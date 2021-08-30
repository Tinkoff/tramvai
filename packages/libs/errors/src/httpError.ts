export class HttpError extends Error {
  static errorName = 'HttpError';

  httpStatus: number | undefined;

  constructor({
    message = 'Http Error',
    httpStatus,
    ...additionalFields
  }: {
    message?: string;
    httpStatus?: number;
    [key: string]: any;
  }) {
    super(message);
    this.name = HttpError.errorName;
    this.httpStatus = httpStatus;
    Object.assign(this, additionalFields);
  }
}
