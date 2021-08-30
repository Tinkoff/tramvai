/* eslint-disable jest/expect-expect */
import React from 'react';
import { useStore } from './useStore';
import { createReducer } from '../..';

type IsNumber<P> = P extends number ? 1 : 0;
type IsString<P> = P extends string ? 1 : 0;
type IsBoolean<P> = P extends boolean ? 1 : 0;
type IsArray<P> = P extends [] ? 1 : 0;
type IsAny<P> = P extends never ? 1 : 0;

//
// Для проверки на точное значение, и что оно не является не any,
// необходимо проверять и на IsAny, и на конкретный тип.
// Если значение верное - оно пройдет обе проверки.
// Если значение не верное - упадет проверка на конкретный тип.
// Если значение any - упадет IsAny.
//

const createMockStore = (storeName: string) => {
  return createReducer(storeName, 1);
};

describe('check useStoreSelector type infer', () => {
  it('infer right store state type', () => {
    const Cmp = () => {
      const store = createMockStore('test');
      const state = useStore(store);

      const isNumber: IsNumber<typeof state> = 1;
      // @ts-expect-error
      const isAny: IsAny<typeof state> = 1;

      return null;
    };
  });
});
/* eslint-enable jest/expect-expect */
