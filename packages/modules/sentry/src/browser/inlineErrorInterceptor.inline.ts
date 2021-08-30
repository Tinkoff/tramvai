// Идея взята из https://github.com/getsentry/sentry-javascript/blob/master/packages/browser/src/loader.js

/* eslint-disable prefer-rest-params */

export function createErrorInterceptor(namespace) {
  const originalOnError = window.onerror;
  const originalOnUnhandledRejection = window.onunhandledrejection;

  function getFromNamespace() {
    return window[namespace] as any;
  }

  function setToNamespace(obj) {
    window[namespace] = obj;
  }

  function onError(errorObj) {
    getFromNamespace().errorsQueue.push(errorObj);
  }

  // eslint-disable-next-line max-params, func-names
  window.onerror = function (message, source, lineno, colno, exception) {
    getFromNamespace().onError({ error: [].slice.call(arguments) });

    if (originalOnError) {
      originalOnError.apply(window, arguments);
    }
  };

  // eslint-disable-next-line func-names
  window.onunhandledrejection = function (e) {
    getFromNamespace().onError({
      promise: [
        // eslint-disable-next-line no-nested-ternary
        'reason' in e ? e.reason : 'detail' in e && 'reason' in e.detail ? e.detail.reason : e,
      ],
    });

    if (originalOnUnhandledRejection) {
      originalOnUnhandledRejection.apply(window, arguments);
    }
  };

  function clear() {
    window.onerror = originalOnError;
    window.onunhandledrejection = originalOnUnhandledRejection;

    delete window[namespace];
  }

  setToNamespace({
    errorsQueue: [],
    clear,
    onError,
  });
}

/* eslint-enable prefer-rest-params */
