import { createToken } from '@tinkoff/dippy';
import type { Sentry, SentryOptions, SentryRequestOptions, Event, EventHint } from './types.h';

export const SENTRY_TOKEN = createToken<Sentry>('sentry');
export const SENTRY_DSN_TOKEN = createToken<string>('sentryDSNToken');
export const SENTRY_OPTIONS_TOKEN = createToken<SentryOptions[]>('sentryOptions', {
  multi: true,
});
export const SENTRY_REQUEST_OPTIONS_TOKEN = createToken<SentryRequestOptions[]>(
  'sentryRequestOptions',
  {
    multi: true,
  }
);
export const SENTRY_LAZY_LOADING = createToken<boolean>('sentryLazyLoading');

export type ErrorsFilter = (event: Event, hint?: EventHint) => boolean;

export const SENTRY_FILTER_ERRORS = createToken<ErrorsFilter>('SENTRY_FILTER_ERRORS', {
  multi: true,
});
