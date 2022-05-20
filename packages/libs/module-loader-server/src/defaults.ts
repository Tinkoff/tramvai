import noop from '@tinkoff/utils/function/noop';

export const DEFAULT_LOGGER = {
  trace: noop,
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
};

export const DEFAULT_TIMEOUT = 2000;
