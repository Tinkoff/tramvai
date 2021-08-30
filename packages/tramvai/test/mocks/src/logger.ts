import noop from '@tinkoff/utils/function/noop';
import type { Logger, LoggerFactory } from '@tramvai/tokens-common';

export const createMockLogger = (): LoggerFactory => {
  const logger: Logger = {
    trace: noop,
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
    fatal: noop,

    child: () => logger,

    addBeforeReporter: noop,
    setBeforeReporters: noop,
    addReporter: noop,
    setReporters: noop,
    addFilter: noop,
    setFilters: noop,
    addExtension: noop,
    setExtensions: noop,
  };

  return Object.assign(() => logger, logger);
};
