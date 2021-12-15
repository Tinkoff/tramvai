import noop from '@tinkoff/utils/function/noop';

export const DEFAULT_LOGGER = {
  trace: noop,
  debug: noop,
  info: noop,
  warning: noop,
  error: noop,
};
