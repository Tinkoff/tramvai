import isFunction from '@tinkoff/utils/is/function';
import { getLogger } from '../../logger';

export function verifyFunction(value: any, displayName: string, methodName: string) {
  if (!isFunction(value)) {
    getLogger().debug(
      `${methodName}() in ${displayName} must be a function. Instead received ${JSON.stringify(
        value
      )}.`
    );
  }
}
