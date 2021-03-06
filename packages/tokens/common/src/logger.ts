import type { Logger } from '@tinkoff/logger';
import { createToken } from '@tinkoff/dippy';

/**
 * @description
 * Logger implementation
 */
export const LOGGER_TOKEN = createToken<LoggerFactory>('logger');

/**
 * @description
 * Hook to be able to modify logger on initialization
 */
export const LOGGER_INIT_HOOK = createToken<LoggerInitHook>('loggerHook');

type Config = {
  name: string;
  [key: string]: any;
};

export type LoggerFactory = Logger & ((configOrName: string | Config) => Logger);

type LoggerInitHook = (logger: LoggerFactory) => void;

export type { Logger, LogFn, LogArg } from '@tinkoff/logger';
