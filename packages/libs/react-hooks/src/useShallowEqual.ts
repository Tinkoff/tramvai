import { useRef } from 'react';
import shallowEqual from '@tinkoff/utils/is/shallowEqual';

export const useShallowEqual = <T>(params: T) => {
  const ref = useRef<T>(params);

  if (!shallowEqual(ref.current, params)) {
    ref.current = params;
  }

  return ref.current;
};
