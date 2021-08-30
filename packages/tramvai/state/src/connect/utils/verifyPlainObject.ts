import isPlainObject from '@tinkoff/utils/is/plainObject';
import { getLogger } from '../../logger';

export function verifyPlainObject(value: any, displayName: string, methodName: string) {
  if (!isPlainObject(value)) {
    getLogger().debug(
      `${methodName}() in ${displayName} must return a plain object. Instead received ${value}.`
    );
  }
}
