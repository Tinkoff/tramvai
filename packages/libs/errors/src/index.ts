import { NotFoundError } from './notFound';
import { RedirectFoundError } from './redirect';
import { HttpError } from './httpError';
import { SilentError } from './silentError';

export const throwNotFoundError = (parameters?: ConstructorParameters<typeof NotFoundError>[0]) => {
  throw new NotFoundError(parameters);
};

export const throwRedirectFoundError = (
  parameters: ConstructorParameters<typeof RedirectFoundError>[0]
) => {
  throw new RedirectFoundError(parameters);
};

export const throwHttpError = (parameters: ConstructorParameters<typeof HttpError>[0]) => {
  throw new HttpError(parameters);
};

export const isNotFoundError = (err: Error): err is NotFoundError => {
  return err.name === NotFoundError.errorName;
};

export const isRedirectFoundError = (err: Error): err is RedirectFoundError => {
  return err.name === RedirectFoundError.errorName;
};

export const isHttpError = (err: Error): err is HttpError => {
  return err.name === HttpError.errorName || isNotFoundError(err) || isRedirectFoundError(err);
};

export const isSilentError = (err: Error): err is SilentError => {
  return !!(err as any).isSilent;
};

export const makeErrorSilent = <E extends Error>(err: E): E => {
  // eslint-disable-next-line no-param-reassign
  (err as any).isSilent = true;
  return err;
};

export { NotFoundError, RedirectFoundError, HttpError, SilentError };
