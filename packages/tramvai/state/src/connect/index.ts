import shallowEqual from '@tinkoff/utils/is/shallowEqual';
import strictEqual from '@tinkoff/utils/is/strictEqual';
import { connectAdvanced } from './connectAdvanced';
import { mapContextToPropsFactories as defaultMapContextToPropsFactories } from './toProps/mapContextToProps';
import { mapStateToPropsFactories as defaultMapStateToPropsFactories } from './toProps/mapStateToProps';
import { mergePropsFactories as defaultMergePropsFactories } from './toProps/mergeProps';
import { finalPropsSelectorFactory as defaultSelectorFactory } from './selectorFactory';
import { ConnectContext } from './context';
import { scheduling } from './scheduling';
import type { ConsumerContext } from './types';
import type { StoreClass } from '../typings';
import type { MapContextToProps, MapStateToProps, MergeProps } from './toProps/types';

/*
  connect is a facade over connectAdvanced. It turns its args into a compatible
  selectorFactory, which has the signature:
    (dispatch, options) => (nextState, nextOwnProps) => nextFinalProps

  connect passes its args to connectAdvanced as options, which will in turn pass them to
  selectorFactory each time a Connect component instance is instantiated or hot reloaded.
  selectorFactory returns a final props selector from its mapStateToProps,
  mapStateToPropsFactories, mapContextToProps, mapContextToPropsFactories, mergeProps,
  mergePropsFactories, and pure args.
  The resulting final props selector is called by the Connect component instance whenever
  it receives new props or store state.
 */

function match<T>(arg: T | undefined, factories: Array<(arg?: T) => any>, name: string) {
  for (let i = factories.length - 1; i >= 0; i--) {
    const result = factories[i](arg);

    if (result) {
      return result;
    }
  }

  return (context: ConsumerContext, options: any) => {
    throw new Error(
      `Invalid value of type ${typeof arg} for ${name} argument when connecting component ${
        options.wrappedComponentName
      }.`
    );
  };
}

// createConnect with default args builds the 'official' connect behavior. Calling it with
// different options opens up some testing and extensibility scenarios
export function createConnect({
  connectHOC = connectAdvanced,
  mapStateToPropsFactories = defaultMapStateToPropsFactories,
  mapContextToPropsFactories = defaultMapContextToPropsFactories,
  mergePropsFactories = defaultMergePropsFactories,
  selectorFactory = defaultSelectorFactory,
  schedule = scheduling(),
} = {}) {
  return (
    stores: (StoreClass | string | { store: StoreClass | string; optional: boolean })[],
    mapStateToProps: MapStateToProps,
    mapContextToProps?: MapContextToProps,
    mergeProps?: MergeProps,
    {
      pure = true,
      areStatesEqual = strictEqual,
      areOwnPropsEqual = shallowEqual,
      areStatePropsEqual = shallowEqual,
      areMergedPropsEqual = shallowEqual,
      ...extraOptions
    } = {}
    // eslint-disable-next-line max-params
  ) => {
    // @ts-ignore
    const initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
    // @ts-ignore
    const initMapContextToProps = match(
      mapContextToProps,
      // @ts-ignore
      mapContextToPropsFactories,
      'mapContextToProps'
    );
    // @ts-ignore
    const initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');

    return connectHOC(selectorFactory, {
      // @ts-ignore
      stores,

      // passed through to selectorFactory 2
      // @ts-ignore
      initMapStateToProps,
      initMapContextToProps,
      initMergeProps,
      pure,
      areStatesEqual,
      areOwnPropsEqual,
      areStatePropsEqual,
      areMergedPropsEqual,
      schedule,

      // used in error messages
      methodName: 'connect',

      // used to compute Connect's displayName from the wrapped component's displayName.
      getDisplayName: (name) => `Connect(${name})`,

      // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
      shouldHandleStateChanges: stores && stores.length > 0,

      // any extra options args can override defaults of connect or connectAdvanced
      ...extraOptions,
    });
  };
}

// __PURE__ добавлен для включения tree shaking в сборке. Без него terser не выкенет connect
const connect = /* @__PURE__ */ createConnect();
const { Consumer } = ConnectContext;

// eslint-disable-next-line import/no-default-export
export default connect;
export { connect };
export { Provider } from './Provider';
export { Consumer };
export { ConsumerContext } from './types';
export * from './hooks';
