/* eslint-disable prefer-destructuring */
import isString from '@tinkoff/utils/is/string';
import isObject from '@tinkoff/utils/is/object';
import isArray from '@tinkoff/utils/is/array';
import { safeStringifyJSON } from '@tramvai/safe-strings';

import type { LogObj } from '../../logger.h';

export const formatError = (error: Error | string) => {
  if (isString(error)) {
    // eslint-disable-next-line no-param-reassign
    error = new Error(error);
  }

  return {
    ...error,
    // @ts-ignore
    // хотим чтобы всегда был единый формат для error.body и error.code [text]
    // игнор потому что в error нет поля body и code
    body: safeStringifyJSON(error.body),
    // @ts-ignore
    code: safeStringifyJSON(error.code),
    message: error.message,
    stack: error.stack,
  };
};

interface JsonLog {
  message: string;
  args?: unknown[];
  error?: ReturnType<typeof formatError>;
  [key: string]: unknown;
}

export const formatJson = (logObj: LogObj): JsonLog => {
  let fields = null;
  let message;
  let error;
  const { args } = logObj;

  if (args[0] instanceof Error) {
    error = formatError(args[0]);

    if (isString(args[1])) {
      message = args[1];
    } else {
      message = args[0].message;
    }
  } else if (isObject(args[0]) && !isArray(args[0])) {
    fields = args[0];
    error = fields.error && formatError(fields.error);

    if (args[0].message) {
      message = args[0].message;
    } else if (isString(args[1])) {
      message = args[1];
    }
  } else {
    message = args[0];
  }

  const otherArgs = args.slice(message === args[1] ? 2 : 1).map((arg) => {
    if (arg instanceof Error) {
      return { error: formatError(arg) };
    }

    return arg;
  });

  return {
    ...logObj,
    args: otherArgs.length ? otherArgs : undefined,
    ...fields,
    error,
    message,
  };
};

/* eslint-enable prefer-destructuring */
