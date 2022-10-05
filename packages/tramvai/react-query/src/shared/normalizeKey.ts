import isArray from '@tinkoff/utils/is/array';
import type { QueryKey } from '@tanstack/react-query';
import type { ReactQueryKeyOrString } from '../baseQuery/types';

export const normalizeKey = (key: ReactQueryKeyOrString): QueryKey => {
  if (isArray(key)) {
    return key;
  }

  return [key];
};
