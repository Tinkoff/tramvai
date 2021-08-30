export interface Logger {
  debug: (...args: unknown[]) => any;
  info: (...args: unknown[]) => any;
  error: (...args: unknown[]) => any;
}

export type ResultTransform = (result: any[]) => any;

export interface Options {
  logger?: Logger;
  resultTransform?: ResultTransform;
}
