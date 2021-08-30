import applyOrReturn from '@tinkoff/utils/function/applyOrReturn';
import noop from '@tinkoff/utils/function/noop';
import * as SentrySdk from '@sentry/node';
import { SENTRY_METHODS } from '../shared/constants';
import type { Sentry } from '../types.h';

export function createSentry(): Sentry {
  const sentry = SENTRY_METHODS.reduce((api, method) => {
    // eslint-disable-next-line no-param-reassign
    api[method] = SentrySdk[method];
    return api;
  }, {}) as any;

  sentry.init = (options) => {
    return SentrySdk.init(applyOrReturn([SentrySdk], options));
  };

  sentry.forceLoad = noop;

  return sentry;
}
