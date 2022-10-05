import noop from '@tinkoff/utils/function/noop';

export const noopLogger = {
  log: noop,
  warn: noop,
  error: noop,
};
