import hoistStatics from 'hoist-non-react-statics';
import invariant from 'invariant';
import type { FunctionComponent } from 'react';
import React, { useMemo, useRef, useReducer, Component } from 'react';
import { isValidElementType } from 'react-is';
import { Subscription } from './Subscription';
import { useConsumerContext, useIsomorphicLayoutEffect } from './hooks';
import type { ConsumerContext } from './types';

// Define some constant arrays just to avoid re-creating these
const EMPTY_ARRAY: void[] = [];

const stringifyComponent = (Comp: any) => {
  try {
    return JSON.stringify(Comp);
  } catch (err) {
    return String(Comp);
  }
};

function storeStateUpdatesReducer(state: any, action: any) {
  const [, updateCount] = state;
  return [action.payload, updateCount + 1];
}

const initStateUpdates = () => [null, 0];

export function connectAdvanced(
  /*
    selectorFactory is a func that is responsible for returning the selector function used to
    compute new props from state, props, and dispatch. For example:
      export default connectAdvanced((dispatch, options) => (state, props) => ({
        thing: state.things[props.thingId],
        saveThing: fields => dispatch(actionCreators.saveThing(props.thingId, fields)),
      }))(YourComponent)
    Access to dispatch is provided to the factory so selectorFactories can bind actionCreators
    outside of their selector as an optimization. Options passed to connectAdvanced are passed to
    the selectorFactory, along with displayName and WrappedComponent, as the second argument.
    Note that selectorFactory is responsible for all caching/memoization of inbound and outbound
    props. Do not use connectAdvanced directly without memoizing results between calls to your
    selector, otherwise the Connect component will re-render on every state or props change.
  */
  selectorFactory: (context: ConsumerContext, options: any) => any,
  // options object:
  {
    // the func used to compute this HOC's displayName from the wrapped component's displayName.
    // probably overridden by wrapper functions such as connect()
    getDisplayName = (name: string) => `ConnectAdvanced(${name})`,

    // shown in error messages
    // probably overridden by wrapper functions such as connect()
    methodName = 'connectAdvanced',

    // stores to connect to
    stores = [],

    // determines whether this HOC subscribes to store changes
    shouldHandleStateChanges = true,

    // use React's forwardRef to expose a ref of the wrapped component
    forwardRef = false,

    // function used to schedule updates
    schedule = (fn: Function) => fn(),

    // is component and all toProps functions are pure, so they can be memoized
    pure = true,

    // additional options are passed through to the selectorFactory
    ...connectOptions
  } = {}
) {
  return function wrapWithConnect<T extends React.ComponentType>(WrappedComponent: T) {
    if (process.env.NODE_ENV !== 'production') {
      invariant(
        isValidElementType(WrappedComponent),
        `You must pass a component to the function returned by ` +
          `${methodName}. Instead received ${stringifyComponent(WrappedComponent)}`
      );
    }

    const wrappedComponentName =
      (WrappedComponent as any).displayName || (WrappedComponent as any).name || 'Component';

    const displayName = getDisplayName(wrappedComponentName);

    const selectorFactoryOptions = {
      ...connectOptions,
      pure,
      getDisplayName,
      methodName,
      shouldHandleStateChanges,
      displayName,
      wrappedComponentName,
      WrappedComponent,
    };

    // If we aren't running in "pure" mode, we don't want to memoize values.
    // To avoid conditionally calling hooks, we fall back to a tiny wrapper
    // that just executes the given callback immediately.
    const usePureOnlyMemo = pure ? useMemo : (callback: Function) => callback();

    const ConnectFunction: FunctionComponent<any> = (props) => {
      const [forwardedRef, wrapperProps] = useMemo(() => {
        // Distinguish between actual "data" props that were passed to the wrapper component,
        // and values needed to control behavior (forwarded refs, alternate context instances).
        // To maintain the wrapperProps object reference, memoize this destructuring.
        // eslint-disable-next-line no-shadow
        const { forwardedRef, ...wrapperProps } = props;

        return [forwardedRef, wrapperProps];
      }, [props]);

      // Retrieve the store and ancestor subscription via context, if available
      const contextValue = useConsumerContext();

      invariant(
        Boolean(contextValue),
        `Could not find context in ` +
          `"${displayName}". Either wrap the root component in a <Provider>, ` +
          `or pass a custom React context provider to <Provider> and the corresponding ` +
          `React context consumer to ${displayName} in connect options.`
      );

      const childPropsSelector = useMemo(() => {
        // The child props selector needs the store reference as an input.
        // Re-create this selector whenever the store changes.
        return selectorFactory(contextValue, selectorFactoryOptions);
      }, [contextValue]);

      const subscription = useMemo(() => {
        if (!shouldHandleStateChanges) return null;

        return new Subscription(stores.map((store) => contextValue.getStore(store)));
      }, [contextValue]);

      useMemo(() => {
        if (subscription && typeof window !== 'undefined') {
          subscription.trySubscribe();
        }
      }, [subscription]);

      // We need to force this wrapper component to re-render whenever a Redux store update
      // causes a change to the calculated child component props (or we caught an error in mapState)
      const [[previousStateUpdateResult], forceComponentUpdateDispatch] = useReducer(
        storeStateUpdatesReducer,
        EMPTY_ARRAY,
        initStateUpdates
      );

      // Propagate any mapState/mapDispatch errors upwards
      if (previousStateUpdateResult && previousStateUpdateResult.error) {
        throw previousStateUpdateResult.error;
      }

      // Set up refs to coordinate values between the subscription effect and the render logic
      const lastChildProps = useRef();
      const lastWrapperProps = useRef(wrapperProps);
      const childPropsFromStoreUpdate = useRef();
      const renderIsScheduled = useRef(false);

      const actualChildProps = usePureOnlyMemo(() => {
        // Tricky logic here:
        // - This render may have been triggered by a Redux store update that produced new child props
        // - However, we may have gotten new wrapper props after that
        // If we have new child props, and the same wrapper props, we know we should use the new child props as-is.
        // But, if we have new wrapper props, those might change the child props, so we have to recalculate things.
        // So, we'll use the child props from store update only if the wrapper props are the same as last time.
        if (childPropsFromStoreUpdate.current && wrapperProps === lastWrapperProps.current) {
          return childPropsFromStoreUpdate.current;
        }

        // TODO We're reading the store directly in render() here. Bad idea?
        // This will likely cause Bad Things (TM) to happen in Concurrent Mode.
        // Note that we do this because on renders _not_ caused by store updates, we need the latest store state
        // to determine what the child props should be.
        return childPropsSelector(contextValue.getState(), wrapperProps);
      }, [contextValue, previousStateUpdateResult, wrapperProps]);

      // We need this to execute synchronously every time we re-render. However, React warns
      // about useLayoutEffect in SSR, so we try to detect environment and fall back to
      // just useEffect instead to avoid the warning, since neither will run anyway.
      useIsomorphicLayoutEffect(() => {
        // We want to capture the wrapper props and child props we used for later comparisons
        lastWrapperProps.current = wrapperProps;
        lastChildProps.current = actualChildProps;

        // If the render was from a store update, clear out that reference and cascade the subscriber update
        if (childPropsFromStoreUpdate.current) {
          childPropsFromStoreUpdate.current = undefined;
        }
      });

      // Our re-subscribe logic only runs when the store/subscription setup changes
      useIsomorphicLayoutEffect(() => {
        // If we're not subscribed to the store, nothing to do here
        if (!subscription) return;

        // Capture values for checking if and when this component unmounts
        let didUnsubscribe = false;
        let lastThrownError: Error | null = null;

        // We'll run this callback every time a store subscription update propagates to this component
        const checkForUpdates = () => {
          renderIsScheduled.current = false;

          if (didUnsubscribe) {
            // Don't run stale listeners.
            // Redux doesn't guarantee unsubscriptions happen until next dispatch.
            return;
          }

          const latestStoreState = contextValue.getState();

          let newChildProps;
          let error;

          try {
            // Actually run the selector with the most recent store state and wrapper props
            // to determine what the child props should be
            newChildProps = childPropsSelector(latestStoreState, lastWrapperProps.current);
          } catch (e) {
            error = e;
            lastThrownError = e;
          }

          if (!error) {
            lastThrownError = null;
          }

          // If the child props haven't changed, nothing to do here - cascade the subscription update
          if (newChildProps !== lastChildProps.current) {
            // Save references to the new child props.  Note that we track the "child props from store update"
            // as a ref instead of a useState/useReducer because we need a way to determine if that value has
            // been processed.  If this went into useState/useReducer, we couldn't clear out the value without
            // forcing another re-render, which we don't want.
            lastChildProps.current = newChildProps;
            childPropsFromStoreUpdate.current = newChildProps;

            // If the child props _did_ change (or we caught an error), this wrapper component needs to re-render
            forceComponentUpdateDispatch({
              type: 'STORE_UPDATED',
              payload: {
                latestStoreState,
                error,
              },
            });
          }
        };

        // Actually subscribe to the nearest connected ancestor (or store)
        subscription.setOnStateChange(() => {
          if (!renderIsScheduled.current) {
            renderIsScheduled.current = true;
            schedule(checkForUpdates);
          }
        });

        // Pull data from the store after first render in case the store has
        // changed since we began.
        checkForUpdates();

        const unsubscribeWrapper = () => {
          didUnsubscribe = true;
          subscription.tryUnsubscribe();

          if (lastThrownError) {
            // It's possible that we caught an error due to a bad mapState function, but the
            // parent re-rendered without this component and we're about to unmount.
            // This shouldn't happen as long as we do top-down subscriptions correctly, but
            // if we ever do those wrong, this throw will surface the error in our tests.
            // In that case, throw the error from here so it doesn't get lost.
            throw lastThrownError;
          }
        };

        return unsubscribeWrapper;
      }, [contextValue, subscription, childPropsSelector]);

      // Now that all that's done, we can finally try to actually render the child component.
      // We memoize the elements for the rendered child component as an optimization.
      const renderedWrappedComponent = useMemo(
        // eslint-disable-next-line react/jsx-props-no-spreading
        () => <WrappedComponent {...actualChildProps} ref={forwardedRef} />,
        [forwardedRef, actualChildProps]
      );

      return renderedWrappedComponent;
    };

    // If we're in "pure" mode, ensure our wrapper component only re-renders when incoming props have changed.
    const Connect = pure ? React.memo(ConnectFunction) : ConnectFunction;

    (Connect as any).WrappedComponent = WrappedComponent;
    Connect.displayName = displayName;

    if (forwardRef) {
      const forwarded = React.forwardRef(function forwardConnectRef(props, ref) {
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <Connect {...props} forwardedRef={ref} />;
      });

      forwarded.displayName = displayName;
      (forwarded as any).WrappedComponent = WrappedComponent;
      return (hoistStatics(forwarded, WrappedComponent) as any) as T;
    }

    return hoistStatics(Connect, WrappedComponent) as T;
  };
}
