export class ExecutionError extends Error {
  static errorName = 'ExecutionError';

  cause?: Error;
  contextName?: string;

  constructor({
    message = 'Execution Error',
    cause,
    contextName,
    ...additionalFields
  }: {
    message?: string;
    contextName?: string;
    cause?: Error;
    [key: string]: any;
  } = {}) {
    super(message);
    this.name = ExecutionError.errorName;
    this.cause = cause;
    this.contextName = contextName;
    Object.assign(this, additionalFields);
  }
}
