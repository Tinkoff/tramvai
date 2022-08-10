import { HttpError } from './httpError';

export class RedirectFoundError extends HttpError {
  static errorName = 'RedirectFoundError';

  nextUrl: string;

  httpStatus: number;

  constructor({
    message = 'Redirect Found',
    nextUrl,
    httpStatus = 307,
    ...additionalFields
  }: {
    message?: string;
    nextUrl: string;
    httpStatus?: number;
    [key: string]: any;
  }) {
    super({ message, httpStatus });
    this.name = RedirectFoundError.errorName;
    this.nextUrl = nextUrl;
    this.httpStatus = httpStatus;
    Object.assign(this, additionalFields);
  }
}
