import utilsIsNumber from '@tinkoff/utils/is/number';
import utilsIsString from '@tinkoff/utils/is/string';

export type Validator = (value: string) => string | boolean;

export const isUrl: Validator = (value: string) => {
  if (!value) {
    return 'value should not be empty';
  }
  let url;

  try {
    if (value.startsWith('/')) {
      url = new URL(value, 'http://localhost:3000');
    } else {
      url = new URL(value);
    }
  } catch (_) {
    return 'URL is not valid';
  }

  return (
    url.protocol !== 'http:' && url.protocol !== 'https:' && `Invalid protocol ${url.protocol}`
  );
};

export const isNumber: Validator = (value: string) => {
  if (!value) {
    return 'value should not be empty';
  }

  const convertedValue = +value;
  if (utilsIsNumber(convertedValue) && !Number.isNaN(convertedValue)) {
    return true;
  }

  return 'value is not a number';
};

export const isTrue: Validator = (value: string) => {
  if (!value) {
    return 'value should not be empty';
  }

  if (value === 'true') {
    return true;
  }

  return 'value is not a true';
};

export const isFalse: Validator = (value: string) => {
  if (!value) {
    return 'value should not be empty';
  }

  if (value === 'false') {
    return true;
  }

  return 'value is not a false';
};

export const isOneOf = (values: string[] = []): Validator => (value: string) => {
  if (!value) {
    return 'value should not be empty';
  }

  if (values.indexOf(value) !== -1) {
    return true;
  }

  return 'value is not in list';
};

export const startsWith = (prefix: string): Validator => (value: string) => {
  if (!value) {
    return 'value should not be empty';
  }

  if (value.startsWith(prefix)) {
    return true;
  }

  return `value should starts with ${prefix}`;
};

export const endsWith = (postfix: string): Validator => (value: string) => {
  if (!value) {
    return 'value should not be empty';
  }

  if (value.endsWith(postfix)) {
    return true;
  }

  return `value should ends with ${postfix}`;
};

export const combineValidators = (validators: Validator[]): Validator => (value) => {
  const result = validators.reduce((acc: any, validator) => {
    const currentValidatorResult = validator(value);

    if (utilsIsString(currentValidatorResult)) {
      // В текущем валидаторе вылезла ошибка
      return utilsIsString(acc)
        ? // В предыдущих валидаторах были ошибки, сохраним все тексты
          `${acc}; ${currentValidatorResult}`
        : // В предыдущих валидаторах не было ошибок, вернём текст текущей
          currentValidatorResult;
    }

    // В текущем валидаторе нет ошибки
    return utilsIsString(acc) ? acc : acc && currentValidatorResult;
  }, true);

  return result;
};
