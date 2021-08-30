import always from '@tinkoff/utils/function/always';
import mapObject from '@tinkoff/utils/object/map';

import { verifyPlainObject } from '../utils/verifyPlainObject';
import { verifyFunction } from '../utils/verifyFunction';
import type { ConsumerContext } from '../types';

export interface Options {
  displayName: string;
}

export function wrapMapToPropsConstant(getConstant: Function) {
  return function initConstantSelector(context: ConsumerContext, options: Options) {
    const constantSelector = always(getConstant(context, options));

    (constantSelector as any).dependsOnOwnProps = false;
    return constantSelector;
  };
}

// dependsOnOwnProps is used by createMapToPropsProxy to determine whether to pass props as args
// to the mapToProps function being wrapped. It is also used by makePurePropsSelector to determine
// whether mapToProps needs to be invoked when props have changed.
//
// A length of one signals that mapToProps does not depend on props from the parent component.
// A length of zero is assumed to mean mapToProps is getting args via arguments or ...args and
// therefore not reporting its length accurately..
export function getDependsOnOwnProps(mapToProps: Function & { dependsOnOwnProps?: boolean }) {
  return mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== undefined
    ? Boolean(mapToProps.dependsOnOwnProps)
    : mapToProps.length !== 1;
}

// Used by whenMapStateToPropsIsFunction and whenMapDispatchToPropsIsFunction,
// this function wraps mapToProps in a proxy function which does several things:
//
//  * Detects whether the mapToProps function being called depends on props, which
//    is used by selectorFactory to decide if it should reinvoke on props changes.
//
//  * On first call, handles mapToProps if returns another function, and treats that
//    new function as the true mapToProps for subsequent calls.
//
//  * On first call, verifies the first result is a plain object, in order to warn
//    the developer that their mapToProps function is not returning a valid result.
//
export function wrapMapToPropsFunc(mapToProps: Function, methodName: string) {
  return function initProxySelector(context: ConsumerContext, { displayName }: Options) {
    const proxy: any = (stateOrContext: any, ownProps: any) =>
      proxy.dependsOnOwnProps
        ? proxy.mapToProps(stateOrContext, ownProps)
        : proxy.mapToProps(stateOrContext, undefined);

    // allow detectFactoryAndVerify to get ownProps
    proxy.dependsOnOwnProps = true;

    proxy.mapToProps = function detectFactoryAndVerify(stateOrContext: any, ownProps: any) {
      proxy.mapToProps = mapToProps;
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
      let props = proxy(stateOrContext, ownProps);

      if (typeof props === 'function') {
        proxy.mapToProps = props;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
        props = proxy(stateOrContext, ownProps);
      }

      if (process.env.NODE_ENV !== 'production') {
        verifyPlainObject(props, displayName, methodName);
      }

      return props;
    };

    return proxy;
  };
}

export function wrapMapToPropsObject(actionsObject: any) {
  function getConstant({ executeAction }: ConsumerContext, { displayName }: Options) {
    return mapObject((action, actionName) => {
      if (process.env.NODE_ENV !== 'production') {
        verifyFunction(action, displayName, actionName);
      }
      return (params: any) => executeAction(action, params);
    }, actionsObject);
  }
  return wrapMapToPropsConstant(getConstant);
}
