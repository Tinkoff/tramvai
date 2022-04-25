import noop from '@tinkoff/utils/function/noop';
import hoistStatics from 'hoist-non-react-statics';
import invariant from 'invariant';
import type { FunctionComponent } from 'react';
import { useContext } from 'react';
import { useCallback } from 'react';
import React, { useMemo, useRef } from 'react';
import { isValidElementType } from 'react-is';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { Subscription } from './Subscription';
import { useConsumerContext } from './hooks';
import type { ConsumerContext } from './types';
import { ServerStateContext } from './context';

const stringifyComponent = (Comp: any) => {
  try {
    return JSON.stringify(Comp);
  } catch (err) {
    return String(Comp);
  }
};

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
      const serverState = useContext(ServerStateContext);

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

      const renderIsScheduled = useRef(false);

      const actualChildPropsSelector = useCallback(() => {
        return childPropsSelector(contextValue.getState(), wrapperProps);
      }, [contextValue, wrapperProps, childPropsSelector]);

      // Our re-subscribe logic only runs when the store/subscription setup changes
      const subscribe = useCallback(
        (reactUpdate: () => void) => {
          if (!subscription) {
            return noop;
          }

          subscription.setOnStateChange(() => {
            if (!renderIsScheduled.current) {
              renderIsScheduled.current = true;
              schedule(() => {
                reactUpdate();
                renderIsScheduled.current = false;
              });
            }
          });

          return () => {
            return subscription.tryUnsubscribe();
          };
        },
        [subscription]
      );

      const actualChildProps = useSyncExternalStore(
        subscribe,
        actualChildPropsSelector,
        serverState ? () => childPropsSelector(serverState, wrapperProps) : actualChildPropsSelector
      );

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
