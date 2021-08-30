import type { ConsumerContext } from '../types';

export type DependsOnOwnProps<T> = T & { dependsOnOwnProps: boolean };
export type MapStateToProps<T = any> = (state: Record<string, any>, ownProps: T) => any;
export type MapContextToProps<T = any> =
  | ((context: ConsumerContext, ownProps: T) => any)
  | Record<string, Function>;
export type MergeProps<P = any, T = any, R = any> = (
  stateProps: P,
  contextProps: T,
  ownProps: R
) => any;
