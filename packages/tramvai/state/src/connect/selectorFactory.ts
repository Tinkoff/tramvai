import type { ConsumerContext } from './types';
import type { DependsOnOwnProps } from './toProps/types';
import { verifyMapToProps } from './utils/verifyMapToProps';

export function impureFinalPropsSelectorFactory(
  mapStateToProps: Function,
  mapContextToProps: Function,
  mergeProps: Function,
  context: ConsumerContext
) {
  return function impureFinalPropsSelector(state: any, ownProps: any) {
    return mergeProps(
      mapStateToProps(state, ownProps),
      mapContextToProps(context, ownProps),
      ownProps
    );
  };
}

// eslint-disable-next-line max-params
export function pureFinalPropsSelectorFactory(
  mapStateToProps: DependsOnOwnProps<Function>,
  mapContextToProps: DependsOnOwnProps<Function>,
  mergeProps: DependsOnOwnProps<Function>,
  context: ConsumerContext,
  { areStatesEqual, areOwnPropsEqual, areStatePropsEqual, WrappedComponent: { defaultProps } }: any
) {
  let hasRunAtLeastOnce = false;
  let state: any;
  let ownProps: any;
  let ownPropsWithDefault: any;
  let stateProps: any;
  let contextProps: any;
  let mergedProps: any;

  function handleFirstCall(firstState: any, firstOwnProps: any) {
    state = firstState;
    ownProps = firstOwnProps;
    ownPropsWithDefault = { ...defaultProps, ...firstOwnProps }; // TODO проверить зачем мержить пропсы с defaultProps, взято из старого connect, иначе падают некоторые тесты
    stateProps = mapStateToProps(state, ownPropsWithDefault);
    contextProps = mapContextToProps(context, ownPropsWithDefault);
    mergedProps = mergeProps(stateProps, contextProps, ownProps);
    hasRunAtLeastOnce = true;
    return mergedProps;
  }

  function handleNewPropsAndNewState() {
    stateProps = mapStateToProps(state, ownPropsWithDefault);

    if (mapContextToProps.dependsOnOwnProps) {
      contextProps = mapContextToProps(context, ownPropsWithDefault);
    }

    mergedProps = mergeProps(stateProps, contextProps, ownProps);
    return mergedProps;
  }

  function handleNewProps() {
    if (mapStateToProps.dependsOnOwnProps) {
      stateProps = mapStateToProps(state, ownPropsWithDefault);
    }

    if (mapContextToProps.dependsOnOwnProps) {
      contextProps = mapContextToProps(context, ownPropsWithDefault);
    }

    mergedProps = mergeProps(stateProps, contextProps, ownProps);
    return mergedProps;
  }

  function handleNewState() {
    const nextStateProps = mapStateToProps(state, ownPropsWithDefault);
    const statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);

    stateProps = nextStateProps;

    if (statePropsChanged) {
      mergedProps = mergeProps(stateProps, contextProps, ownProps);
    }

    return mergedProps;
  }

  function handleSubsequentCalls(nextState: any, nextOwnProps: any) {
    const propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
    const stateChanged = !areStatesEqual(nextState, state);

    state = nextState;
    ownProps = nextOwnProps;
    ownPropsWithDefault = { ...defaultProps, ...nextOwnProps };

    if (propsChanged && stateChanged) {
      return handleNewPropsAndNewState();
    }
    if (propsChanged) {
      return handleNewProps();
    }
    if (stateChanged) {
      return handleNewState();
    }
    return mergedProps;
  }

  return function pureFinalPropsSelector(nextState: any, nextOwnProps: any) {
    return hasRunAtLeastOnce
      ? handleSubsequentCalls(nextState, nextOwnProps)
      : handleFirstCall(nextState, nextOwnProps);
  };
}

// TODO: Add more comments

// If pure is true, the selector returned by selectorFactory will memoize its results,
// allowing connectAdvanced's shouldComponentUpdate to return false if final
// props have not changed. If false, the selector will always return a new
// object and shouldComponentUpdate will always return true.

export function finalPropsSelectorFactory(
  context: ConsumerContext,
  { initMapStateToProps, initMapContextToProps, initMergeProps, ...options }: any
) {
  let mapStateToProps = initMapStateToProps(context, options);
  const mapContextToProps = initMapContextToProps(context, options);
  const mergeProps = initMergeProps(context, options);

  if (process.env.NODE_ENV !== 'production') {
    mapStateToProps = verifyMapToProps(mapStateToProps, options.WrappedComponent.name);
  }

  const selectorFactory = options.pure
    ? pureFinalPropsSelectorFactory
    : impureFinalPropsSelectorFactory;

  return selectorFactory(mapStateToProps, mapContextToProps, mergeProps, context, options as any);
}
