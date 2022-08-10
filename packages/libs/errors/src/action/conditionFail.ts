export class ConditionFailError extends Error {
  static errorName = 'ConditionFailError';

  public isSilent: boolean;

  constructor({
    message = 'Condition failed',
    ...additionalFields
  }: {
    message?: string;
    [key: string]: any;
  } = {}) {
    super(message);
    this.name = ConditionFailError.errorName;
    this.isSilent = true;
    Object.assign(this, additionalFields);
  }
}

export const isConditionFailError = (err: Error): err is ConditionFailError => {
  return err.name === ConditionFailError.errorName;
};
