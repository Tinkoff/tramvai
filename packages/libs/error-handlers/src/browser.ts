import type { Logger } from './types.h';

export const globalErrorHandler = (logger: Logger = console) => {
  // eslint-disable-next-line max-params
  window.onerror = (errorMsg, url, lineNumber, columnNumber, err) => {
    if (
      (url && /((miscellaneus|extension)_bindings|^chrome:|^resource:)/gi.test(url)) ||
      errorMsg instanceof Event ||
      /Script error/.test(errorMsg)
    ) {
      return;
    }

    // eslint-disable-next-line no-param-reassign
    err = err || new Error(errorMsg);

    logger.error(err, {
      url,
      lineNumber,
      columnNumber,
    });
  };
};

export const unhandledRejectionHandler = (logger: Logger = console) => {
  window.addEventListener('unhandledrejection', (event: any) => {
    event.preventDefault();

    const reason = (event.detail && event.detail.reason) || event.reason;
    const message = (reason && reason.message) || 'unhandled rejection';
    const stack = (reason && (reason.stack || reason.stacktrace)) || 'no stack';

    const payload = {
      event: 'unhandledPromiseReject',
      message,
      stack,
      reason: {},
      reasonMessage: '',
    };

    if (reason) {
      if (typeof reason === 'object' && !Array.isArray(reason)) {
        payload.reason = reason;
      } else {
        payload.reasonMessage = reason.toString();
      }
    }

    // не отправляем unhandled rejection ошибки без reason,
    // т.к. их очень много, но они не несут полезной информации для отладки и исправления
    const noMessage = !payload.message || payload.message === 'unhandled rejection';
    const noStack = !payload.stack || payload.stack === 'no stack';
    const reasonObjectIsEmpty =
      payload.reason &&
      typeof payload.reason === 'object' &&
      Object.keys(payload.reason).length === 0;
    const noReason = !payload.reason || reasonObjectIsEmpty;
    const noReasonMessage = !payload.reasonMessage;
    const skipError = noMessage && noStack && noReason && noReasonMessage;

    if (skipError) {
      return;
    }
    logger.error(payload);
  });
};
