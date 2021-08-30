export const SENTRY_SDK_URL = 'https://browser.sentry-cdn.com/5.17.0/bundle.min.js';

// https://github.com/getsentry/sentry-javascript/blob/master/packages/browser/src/loader.js
export const SENTRY_METHODS = [
  'init',
  'addBreadcrumb',
  'captureMessage',
  'captureException',
  'captureEvent',
  'configureScope',
  'withScope',
];

export const ERROR_INTERCEPTOR = '__SENTRY_MODULE_INLINE_ERROR_INTERCEPTOR__';
