/* eslint-disable jest/expect-expect */
import React from 'react';
import { useStoreSelector } from './useStoreSelector';
import { createReducer } from '../..';

const createMockStore = (storeName: string) => {
  return createReducer(storeName, { id: 1 });
};
describe('check useStoreSelector type infer', () => {
  it('has type error with wrong inlined selector argument', () => {
    const Cmp = () => {
      const store = createMockStore('test');
      // @ts-expect-error
      const state = useStoreSelector(store, (something) => something.field);

      return <div>{!!state.x}</div>;
    };
  });
  it('has type error with wrong inlined selector result', () => {
    const Cmp = () => {
      const store = createMockStore('test');
      const state = useStoreSelector(store, (something) => something.id);
      // @ts-expect-error
      return <div>{state.hello}</div>;
    };
  });
  it('has NOT type error with correct inlined selector argument', () => {
    const Cmp = () => {
      const store = createMockStore('test');
      const state = useStoreSelector(store, (something) => something.id);

      return <div>{state}</div>;
    };
  });
  it('has NOT type error with correct selector result', () => {
    const Cmp = () => {
      const store = createMockStore('test');
      const state = useStoreSelector(store, (something) => ({ hello: something.id }));
      return <div>{state.hello}</div>;
    };
  });

  it('has type error with correct selector result', () => {
    const Cmp = () => {
      const store = createMockStore('test');
      const selector = (a: { x: string }) => ({ hello: a.x });
      // @ts-expect-error
      const state = useStoreSelector(store, selector);
      return <div>{state}</div>;
    };
  });
  it('has type error with not correct using selector result', () => {
    const Cmp = () => {
      const store = createMockStore('test');
      const selector = (a: { id: number }) => a.id;
      const state = useStoreSelector(store, selector);
      // @ts-expect-error
      return <div>{state.hello}</div>;
    };
  });
});
/* eslint-enable jest/expect-expect */
