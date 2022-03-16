export class SilentError extends Error {
  static errorName = 'SilentError';

  isSilent = true;

  constructor(message: string) {
    super(message);
    this.name = SilentError.errorName;
  }
}
