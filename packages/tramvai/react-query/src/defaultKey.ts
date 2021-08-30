import isString from '@tinkoff/utils/is/string';
import isArray from '@tinkoff/utils/is/array';
import type { QueryKey as ReactQueryKey } from 'react-query';

export const defaultKey = (options: any): ReactQueryKey => {
  if (isString(options) || isArray(options)) {
    return options;
  }

  return [options];
};
