import { SilentError } from '@tinkoff/errors';

export class StopCommandLineRunnerError extends SilentError {
  static errorName = 'StopCommandLineRunnerError';
  name: string;

  constructor() {
    super('Prevent CommandLineRunner from execution');
    this.name = StopCommandLineRunnerError.errorName;
  }
}

export const isStopCommandLineRunnerError = (error: Error): error is StopCommandLineRunnerError => {
  return error.name === StopCommandLineRunnerError.errorName;
};
