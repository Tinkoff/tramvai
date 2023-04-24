type LogFunction = (...args: unknown[]) => void;

export interface Logger {
  trace: LogFunction;
  debug: LogFunction;
  info: LogFunction;
  warn: LogFunction;
  error: LogFunction;
}

export interface LoadModuleOptions {
  cssUrl?: string;
  resolveOnCssFailed?: boolean;
}
