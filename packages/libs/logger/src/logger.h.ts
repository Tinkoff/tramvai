import type { LEVELS } from './constants';

export type Options = {
  name: string;
  key?: string;
  enabled?: boolean;
  level?: LogLevel;
  beforeReporters?: Reporter[];
  reporters?: Reporter[];
  filters?: Filter[];
  extensions?: Extension[];
  defaults?: any;
};

export type LogArg = {
  event?: string;
  message?: string;
  error?: Error;
  [key: string]: any;
};

export type LogArgs = [LogArg, ...any[]] | [Error, string?, ...any[]] | [string, ...any[]];

export interface LogFn {
  (error: Error, message?: string, ...args: any[]): void;

  (logObj: LogArg, ...args: any[]): void;

  (message: string, ...args: any[]): void;
}

export interface Logger {
  fatal: LogFn;
  error: LogFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
  trace: LogFn;

  child(options: Options | string): Logger;

  addBeforeReporter(reporter: Reporter): void;
  setBeforeReporters(reporters: Reporter | Reporter[]): void;
  addReporter(reporter: Reporter): void;
  setReporters(reporters: Reporter | Reporter[]): void;
  addFilter(filter: Filter): void;
  setFilters(filters: Filter | Filter[]): void;
  addExtension(extension: Extension): void;
  setExtensions(extensions: Extension | Extension[]): void;
}

export type SaveState = {
  level: number;
  enabledName: string[];
  enabledLevel: number[];
};

type LoggerStatic = {
  enable(lvl: string, name?: string): void;
  disable(lvl: string, name?: string): void;
  clear(): void;
  setLevel(level: LogLevel): void;
  setGlobalReporters(reporters: Reporter | Reporter[]): void;
};

export type Factory = Logger & LoggerStatic & ((configOrName: string | Options) => Logger);

export type LogLevel = keyof typeof LEVELS;

export interface LogObj {
  name: string;
  date: Date;
  type?: keyof typeof LEVELS;
  level: number;
  args: LogArgs;
  [key: string]: any;
}

export interface Reporter {
  log(logObj: LogObj): void;
}

export interface Filter {
  filter(logObj: LogObj): boolean;
}

export interface Extension {
  extend(logObj: LogObj): LogObj;
}
