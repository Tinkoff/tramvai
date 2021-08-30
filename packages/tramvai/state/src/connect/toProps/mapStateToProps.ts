import always from '@tinkoff/utils/function/always';
import { wrapMapToPropsFunc, wrapMapToPropsConstant } from './wrapMapToProps';
import type { MapStateToProps } from './types';

export function whenMapStateToPropsIsFunction(mapStateToProps: MapStateToProps) {
  return typeof mapStateToProps === 'function'
    ? wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps')
    : undefined;
}

export function whenMapStateToPropsIsMissing(mapStateToProps: MapStateToProps) {
  return !mapStateToProps ? wrapMapToPropsConstant(always({})) : undefined;
}

export const mapStateToPropsFactories = [
  whenMapStateToPropsIsFunction,
  whenMapStateToPropsIsMissing,
];
