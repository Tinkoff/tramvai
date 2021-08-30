import noop from '@tinkoff/utils/function/noop';

export type LogFn = (data: { event: string; [key: string]: any }) => void;
export interface Logger {
  trace: LogFn;
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFn;
}

// eslint-disable-next-line import/no-mutable-exports
export let logger: Logger = {
  trace: noop,
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
};

export const setLogger = (newLogger: Logger) => {
  logger = newLogger;
};
