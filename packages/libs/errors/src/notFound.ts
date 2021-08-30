import { HttpError } from './httpError';

export class NotFoundError extends HttpError {
  static errorName = 'NotFoundError';

  constructor({ message = 'Not Found', ...additionalFields } = {}) {
    super({ message, httpStatus: 404 });
    this.name = NotFoundError.errorName;
    Object.assign(this, additionalFields);
  }
}
