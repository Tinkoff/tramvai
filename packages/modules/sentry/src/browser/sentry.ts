import find from '@tinkoff/utils/array/find';
import applyOrReturn from '@tinkoff/utils/function/applyOrReturn';
import { SENTRY_METHODS, ERROR_INTERCEPTOR } from '../shared/constants';
import type { Sentry } from '../types.h';

// Идея взята отсюда https://docs.sentry.io/platforms/javascript/#lazy-loading-sentry
// Код частично отсюда https://github.com/getsentry/sentry-javascript/blob/master/packages/browser/src/loader.js

type Options = {
  sdkBundleUrl: string;
  lazyInjecting?: boolean;
  sendGlobalErrorsCount?: (count: number) => void;
};

function getSentrySdk(): Sentry {
  // @ts-ignore
  return window.Sentry;
}

export function createSentry({
  sdkBundleUrl,
  lazyInjecting = false,
  sendGlobalErrorsCount,
}: Options): Sentry {
  const errorInterceptor = window[ERROR_INTERCEPTOR] ?? {};
  const originalInterceptorOnError = errorInterceptor.onError;
  const callsQueue = [];

  let SentrySdk = getSentrySdk();
  let sdkStatus = SentrySdk ? 'loaded' : null;
  let errorsCount = 0;

  function registerMetrics() {
    if (sendGlobalErrorsCount) {
      // обновляем данные метрик при возникновении глобальных ошибок
      // при этом внутри sentry эти обработчики переопределяются, но логика внутри sentry
      // вызывает ранее заданные обработчики, поэтому обработчики ниже будут вызваны явно из sentry
      window.onerror = () => {
        errorsCount += 1;
      };
      window.onunhandledrejection = () => {
        errorsCount += 1;
      };

      window.addEventListener('unload', () => {
        errorsCount && sendGlobalErrorsCount(errorsCount);
      });
    }
  }

  function shouldLoadSdk() {
    if (sdkStatus != null) {
      return false;
    }

    const hasErrors = errorInterceptor.errorsQueue?.length > 0;
    const hasImportantCalls = !!find(
      // withScope тоже - https://github.com/getsentry/sentry-javascript/issues/2294
      ({ method }) => method === 'withScope' || method.indexOf('capture') > -1,
      callsQueue
    );

    return hasErrors || hasImportantCalls;
  }

  function onSdkLoaded() {
    errorInterceptor.clear?.();

    registerMetrics();

    SentrySdk = getSentrySdk();

    if (!SentrySdk) {
      return;
    }

    const originalInit = SentrySdk.init;

    SentrySdk.init = (options) => {
      originalInit(applyOrReturn([SentrySdk], options));
    };

    callsQueue.forEach(({ method, args }) => {
      SentrySdk[method](...args);
    });

    // https://github.com/getsentry/sentry-javascript/blob/master/packages/browser/src/loader.js#L135
    const tracekitErrorHandler = window.onerror;
    const tracekitUnhandledRejectionHandler = window.onunhandledrejection;

    errorInterceptor.errorsQueue?.forEach((errorObj) => {
      if ('error' in errorObj && tracekitErrorHandler) {
        tracekitErrorHandler.apply(window, errorObj.error);
      } else if ('promise' in errorObj && tracekitUnhandledRejectionHandler) {
        tracekitUnhandledRejectionHandler.apply(window, errorObj.promise);
      }
    });
  }

  function loadSdk() {
    sdkStatus = 'loading';

    const sdkScript = document.createElement('script');

    sdkScript.async = true;
    sdkScript.src = sdkBundleUrl;
    sdkScript.crossOrigin = 'anonymous';
    sdkScript.onerror = () => {
      sdkStatus = 'fail';
    };
    sdkScript.onload = () => {
      sdkStatus = 'loaded';
      onSdkLoaded();
    };
    document.head.appendChild(sdkScript);
  }

  function forceLoadSdk() {
    if (sdkStatus == null) {
      loadSdk();
    }
  }

  function tryLoadSdk() {
    if (shouldLoadSdk()) {
      loadSdk();
    }
  }

  errorInterceptor.onError = (...args) => {
    originalInterceptorOnError?.(...args);

    tryLoadSdk();
  };

  const sentry = SENTRY_METHODS.reduce((api, method) => {
    // eslint-disable-next-line no-param-reassign
    api[method] = (...args) => {
      if (SentrySdk) {
        return SentrySdk[method](...args);
      }

      callsQueue.push({ method, args });

      tryLoadSdk();
    };
    return api;
  }, {}) as any;

  sentry.forceLoad = () => {
    forceLoadSdk();
  };

  if (sdkStatus === 'loaded') {
    onSdkLoaded();
  } else if (!lazyInjecting) {
    forceLoadSdk();
  } else {
    tryLoadSdk();
  }

  return sentry;
}
