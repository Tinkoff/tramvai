export class SilentError extends Error {
  static errorName = 'SilentError';

  isSilent = true;

  constructor(message: string) {
    super(message);
    this.name = SilentError.errorName;
  }
}

export const isSilentError = (err: Error): err is SilentError => {
  return !!(err as any).isSilent;
};

export const makeErrorSilent = <E extends Error>(err: E): E => {
  // eslint-disable-next-line no-param-reassign
  (err as any).isSilent = true;
  return err;
};
