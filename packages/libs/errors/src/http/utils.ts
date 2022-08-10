import { HttpError } from './httpError';
import { NotFoundError } from './notFound';
import { RedirectFoundError } from './redirect';

export const throwNotFoundError = (parameters?: ConstructorParameters<typeof NotFoundError>[0]) => {
  throw new NotFoundError(parameters);
};

export const isNotFoundError = (err: Error): err is NotFoundError => {
  return err.name === NotFoundError.errorName;
};

export const throwRedirectFoundError = (
  parameters: ConstructorParameters<typeof RedirectFoundError>[0]
) => {
  throw new RedirectFoundError(parameters);
};

export const isRedirectFoundError = (err: Error): err is RedirectFoundError => {
  return err.name === RedirectFoundError.errorName;
};

export const throwHttpError = (parameters: ConstructorParameters<typeof HttpError>[0]) => {
  throw new HttpError(parameters);
};

export const isHttpError = (err: Error): err is HttpError => {
  return err.name === HttpError.errorName || isNotFoundError(err) || isRedirectFoundError(err);
};
