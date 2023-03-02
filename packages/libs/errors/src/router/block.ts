export class BlockError extends Error {
  static errorName = 'BlockError';

  constructor({
    message = 'Block Error',
    ...additionalFields
  }: {
    message?: string;
    httpStatus?: number;
    [key: string]: any;
  }) {
    super(message);
    this.name = BlockError.errorName;
    Object.assign(this, additionalFields);
  }
}

export const isBlockError = (err: Error): err is BlockError => {
  return err.name === BlockError.errorName;
};
