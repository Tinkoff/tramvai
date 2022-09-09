import { ExecutionAbortError } from './executionAbortError';
import { ExecutionError } from './executionError';
import { ExecutionTimeoutError } from './executionTimeoutError';

export const isExecutionError = (err: Error): err is ExecutionError => {
  return err.name === ExecutionError.errorName;
};

export const isExecutionAbortError = (err: Error): err is ExecutionAbortError => {
  return err.name === ExecutionAbortError.errorName || err.name === ExecutionTimeoutError.errorName;
};

export const isExecutionTimeoutError = (err: Error): err is ExecutionTimeoutError => {
  return err.name === ExecutionTimeoutError.errorName;
};
