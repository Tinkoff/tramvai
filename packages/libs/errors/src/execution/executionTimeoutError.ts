export class ExecutionTimeoutError extends Error {
  static errorName = 'ExecutionTimeoutError';
  contextName?: string;

  constructor({
    message = 'Execution Timeout',
    contextName,
    ...additionalFields
  }: {
    message?: string;
    contextName?: string;
    [key: string]: any;
  } = {}) {
    super(message);
    this.name = ExecutionTimeoutError.errorName;
    this.contextName = contextName;
    Object.assign(this, additionalFields);
  }
}
