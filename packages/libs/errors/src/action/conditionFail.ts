export class ConditionFailError extends Error {
  static errorName = 'ConditionFailError';

  public isSilent: boolean;
  public conditionName: string;
  public targetName: string;

  constructor({
    message = 'Condition failed',
    conditionName,
    targetName,
    ...additionalFields
  }: {
    message?: string;
    conditionName: string;
    targetName: string;
    [key: string]: any;
  }) {
    super(message);
    this.name = ConditionFailError.errorName;
    this.conditionName = conditionName;
    this.targetName = targetName;
    this.isSilent = true;
    Object.assign(this, additionalFields);
  }
}

export const isConditionFailError = (err: Error): err is ConditionFailError => {
  return err.name === ConditionFailError.errorName;
};
