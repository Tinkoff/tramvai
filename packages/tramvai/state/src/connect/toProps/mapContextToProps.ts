import always from '@tinkoff/utils/function/always';
import { wrapMapToPropsConstant, wrapMapToPropsFunc, wrapMapToPropsObject } from './wrapMapToProps';
import type { MapContextToProps } from './types';

export function whenMapContextToPropsIsFunction(mapContextToProps: MapContextToProps) {
  return typeof mapContextToProps === 'function'
    ? wrapMapToPropsFunc(mapContextToProps, 'mapContextToProps')
    : undefined;
}

export function whenMapContextToPropsIsMissing(mapContextToProps: MapContextToProps) {
  return !mapContextToProps ? wrapMapToPropsConstant(always({})) : undefined;
}

export function whenMapContextToPropsIsObject(mapContextToProps: MapContextToProps) {
  return typeof mapContextToProps === 'object' && mapContextToProps !== null
    ? wrapMapToPropsObject(mapContextToProps)
    : undefined;
}

export const mapContextToPropsFactories = [
  whenMapContextToPropsIsObject,
  whenMapContextToPropsIsFunction,
  whenMapContextToPropsIsMissing,
];
