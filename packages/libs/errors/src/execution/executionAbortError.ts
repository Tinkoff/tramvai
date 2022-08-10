export class ExecutionAbortError extends Error {
  static errorName = 'ExecutionAbortError';
  contextName?: string;

  constructor({
    message = 'Execution Abort',
    contextName,
    ...additionalFields
  }: {
    message?: string;
    contextName?: string;
    [key: string]: any;
  }) {
    super(message);
    this.name = ExecutionAbortError.errorName;
    this.contextName = contextName;
    Object.assign(this, additionalFields);
  }
}

export const isExecutionAbortError = (err: Error): err is ExecutionAbortError => {
  return err.name === ExecutionAbortError.errorName;
};
