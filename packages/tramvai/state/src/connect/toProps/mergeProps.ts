import { verifyPlainObject } from '../utils/verifyPlainObject';
import type { MergeProps } from './types';
import type { ConsumerContext } from '../types';

const defaultMergeProps: MergeProps = (stateProps, contextProps, ownProps) => {
  return { ...ownProps, ...stateProps, ...contextProps };
};

interface Options {
  displayName: string;
  pure: boolean;
  areMergedPropsEqual: (nextProps: any, props: any) => boolean;
}

function wrapMergePropsFunc(mergeProps: MergeProps): MergeProps {
  return function initMergePropsProxy(
    context: ConsumerContext,
    { displayName, pure, areMergedPropsEqual }: Options
  ) {
    let hasRunOnce = false;
    let mergedProps: any;

    return function mergePropsProxy(stateProps: any, contextProps: any, ownProps: any) {
      const nextMergedProps = mergeProps(stateProps, contextProps, ownProps);

      if (hasRunOnce) {
        if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps)) {
          mergedProps = nextMergedProps;
        }
      } else {
        hasRunOnce = true;
        mergedProps = nextMergedProps;

        if (process.env.NODE_ENV !== 'production') {
          verifyPlainObject(mergedProps, displayName, 'mergeProps');
        }
      }

      return mergedProps;
    };
  };
}

export function whenMergePropsIsFunction(mergeProps: MergeProps) {
  return typeof mergeProps === 'function' ? wrapMergePropsFunc(mergeProps) : undefined;
}

export function whenMergePropsIsOmitted(mergeProps: MergeProps) {
  return !mergeProps ? () => defaultMergeProps : undefined;
}

export const mergePropsFactories = [whenMergePropsIsFunction, whenMergePropsIsOmitted];
