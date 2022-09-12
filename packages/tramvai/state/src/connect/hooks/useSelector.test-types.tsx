/* eslint-disable jest/expect-expect */
import React from 'react';
import { useSelector } from './useSelector';
import { createReducer, BaseStore } from '../..';

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

class MockStore extends BaseStore<{ id: number }> {
  static storeName = 'test' as const;

  state = { id: 1 };

  inc() {
    // eslint-disable-next-line react/no-access-state-in-setstate
    this.setState({ id: this.state.id + 1 });
  }
}

// eslint-disable-next-line max-statements
describe('useSelector type infer', () => {
  it('infer right result type from single store argument', () => {
    const Component = () => {
      const store = createReducer('test', { id: 1 });
      const result = useSelector(store, (something) => something.test.id);

      const isNumber: IsNumber<typeof result> = 1;
      // @ts-expect-error
      const isAny: IsAny<typeof result> = 1;

      return null;
    };
  });

  it('infer right store name from single store argument, initialState has type', () => {
    const Component = () => {
      type State = { id: number };
      const initialState: State = { id: 1 };

      const store = createReducer('test', initialState);
      const result = useSelector(store, (something) => something.test.id);

      const isNumber: IsNumber<typeof result> = 1;
      // @ts-expect-error
      const isAny: IsAny<typeof result> = 1;

      return null;
    };
  });

  it('UNTYPED CASE! infer any result type from single store name argument', () => {
    const Component = () => {
      const store = createReducer('test', { id: 1 });
      const result = useSelector('test', (something) => something.test.id);

      const isNumber: IsNumber<typeof result> = 1;
      const isAny: IsAny<typeof result> = 1;

      return null;
    };
  });

  it('infer right result type from single optional store argument', () => {
    const Component = () => {
      const store = createReducer('test', { id: 1 });
      const result = useSelector({ store, optional: true }, (something) => something.test.id);

      const isNumber: IsNumber<typeof result> = 1;
      // @ts-expect-error
      const isAny: IsAny<typeof result> = 1;

      return null;
    };
  });

  it('UNTYPED CASE! infer any result type from single optional store name argument', () => {
    const Component = () => {
      const store = createReducer('test', { id: 1 });
      const result = useSelector(
        { store: 'test', optional: true },
        (something) => something.test.id
      );

      const isNumber: IsNumber<typeof result> = 1;
      const isAny: IsAny<typeof result> = 1;

      return null;
    };
  });

  it('infer right result type from array of stores argument, with and without const', () => {
    const Component = () => {
      const store1 = createReducer('test1', { id: 1 });
      const store2 = createReducer('test2', { id: '2' });
      const result1 = useSelector([store1], (something) => something.test1.id);
      const result2 = useSelector([store2], (something) => something.test2.id);
      const result3 = useSelector([store1] as const, (something) => something.test1.id);
      const result4 = useSelector([store2] as const, (something) => something.test2.id);

      const isNumber1: IsNumber<typeof result1> = 1;
      // @ts-expect-error
      const isAny1: IsAny<typeof result1> = 1;

      const isString2: IsString<typeof result2> = 1;
      // @ts-expect-error
      const isAny2: IsAny<typeof result2> = 1;

      const isNumber3: IsNumber<typeof result3> = 1;
      // @ts-expect-error
      const isAny3: IsAny<typeof result3> = 1;

      const isString4: IsString<typeof result4> = 1;
      // @ts-expect-error
      const isAny4: IsAny<typeof result4> = 1;

      return null;
    };
  });

  it('UNTYPED CASE! infer any result type from array of stores names argument, with and without const', () => {
    const Component = () => {
      const store1 = createReducer('test1', { id: 1 });
      const store2 = createReducer('test2', { id: '2' });
      const result1 = useSelector(['test1'], (something) => something.test1.id);
      const result2 = useSelector(['test2'], (something) => something.test2.id);
      const result3 = useSelector(['test1'] as const, (something) => something.test1.id);
      const result4 = useSelector(['test2'] as const, (something) => something.test2.id);

      const isNumber1: IsNumber<typeof result1> = 1;
      const isAny1: IsAny<typeof result1> = 1;

      const isString2: IsString<typeof result2> = 1;
      const isAny2: IsAny<typeof result2> = 1;

      const isNumber3: IsNumber<typeof result3> = 1;
      const isAny3: IsAny<typeof result3> = 1;

      const isString4: IsString<typeof result4> = 1;
      const isAny4: IsAny<typeof result4> = 1;

      return null;
    };
  });

  it('infer right result type from array of optional stores argument, only with const', () => {
    const store1 = createReducer('test1', { id: 1 });
    const store2 = createReducer('test2', { id: '2' });
    const result1 = useSelector(
      [{ store: store1, optional: true }],
      (something) => something.test1.id
    );
    const result2 = useSelector(
      [{ store: store2, optional: true }],
      (something) => something.test2.id
    );
    const result3 = useSelector(
      [{ store: store1, optional: true }] as const,
      (something) => something.test1.id
    );
    const result4 = useSelector(
      [{ store: store2, optional: true }] as const,
      (something) => something.test2.id
    );

    const isNumber1: IsNumber<typeof result1> = 1;
    const isAny1: IsAny<typeof result1> = 1;

    const isString2: IsString<typeof result2> = 1;
    const isAny2: IsAny<typeof result2> = 1;

    const isNumber3: IsNumber<typeof result3> = 1;
    // @ts-expect-error
    const isAny3: IsAny<typeof result3> = 1;

    const isString4: IsString<typeof result4> = 1;
    // @ts-expect-error
    const isAny4: IsAny<typeof result4> = 1;
  });

  it('UNTYPED CASE! infer any result type from single array of optional stores names argument, with and without const', () => {
    const Component = () => {
      const store1 = createReducer('test1', { id: 1 });
      const store2 = createReducer('test2', { id: '2' });
      const result1 = useSelector(
        [{ store: 'test1', optional: true }],
        (something) => something.test1.id
      );
      const result2 = useSelector(
        [{ store: 'test2', optional: true }],
        (something) => something.test2.id
      );
      const result3 = useSelector(
        [{ store: 'test1', optional: true }] as const,
        (something) => something.test1.id
      );
      const result4 = useSelector(
        [{ store: 'test2', optional: true }] as const,
        (something) => something.test2.id
      );

      const isNumber1: IsNumber<typeof result1> = 1;
      const isAny1: IsAny<typeof result1> = 1;

      const isString2: IsString<typeof result2> = 1;
      const isAny2: IsAny<typeof result2> = 1;

      const isNumber3: IsNumber<typeof result3> = 1;
      const isAny3: IsAny<typeof result3> = 1;

      const isString4: IsString<typeof result4> = 1;
      const isAny4: IsAny<typeof result4> = 1;

      return null;
    };
  });

  it('infer right store name from single store argument', () => {
    const Component = () => {
      const store = createReducer('test', { id: 1 });
      // @ts-expect-error
      const result = useSelector(store, (something) => something.WRONG.id);

      return null;
    };
  });

  it('UNTYPED CASE! infer right store name from single store argument, store has generic state only', () => {
    const Component = () => {
      const store = createReducer<{ id: number }>('test', { id: 1 });
      const result = useSelector(store, (something) => something.WRONG.id);

      return null;
    };
  });

  it('infer right store name from single store argument, store has generic state and name', () => {
    const Component = () => {
      const store = createReducer<{ id: number }, 'test'>('test', { id: 1 });
      // @ts-expect-error
      const result = useSelector(store, (something) => something.WRONG.id);

      return null;
    };
  });

  it('infer right store name from single store name argument', () => {
    const Component = () => {
      const store = createReducer('test', { id: 1 });
      // @ts-expect-error
      const result = useSelector('test', (something) => something.WRONG.id);

      return null;
    };
  });

  it('infer right store name from single optional store argument', () => {
    const Component = () => {
      const store = createReducer('test', { id: 1 });
      // @ts-expect-error
      const result = useSelector({ store, optional: true }, (something) => something.WRONG.id);

      return null;
    };
  });

  it('infer right store name from single optional store name argument, if name is const', () => {
    const Component = () => {
      const store = createReducer('test', { id: 1 });
      const result1 = useSelector(
        { store: 'test', optional: true },
        (something) => something.WRONG.id
      );
      const result2 = useSelector(
        { store: 'test' as const, optional: true },
        // @ts-expect-error
        (something) => something.WRONG.id
      );

      return null;
    };
  });

  it('infer right store name from array of stores argument, with and without const', () => {
    const Component = () => {
      const store = createReducer('test', { id: 1 });
      // @ts-expect-error
      const result1 = useSelector([store], (something) => something.WRONG.id);
      // @ts-expect-error
      const result2 = useSelector([store] as const, (something) => something.WRONG.id);

      return null;
    };
  });

  it('infer right store name from array of stores names argument, if array is const', () => {
    const Component = () => {
      const store = createReducer('test', { id: 1 });
      const result1 = useSelector(['test'], (something) => something.WRONG.id);
      // @ts-expect-error
      const result2 = useSelector(['test'] as const, (something) => something.WRONG.id);

      return null;
    };
  });

  it('infer right store name from array of optional stores argument, only with const', () => {
    const Component = () => {
      const store = createReducer('test', { id: 1 });
      const result1 = useSelector([{ store, optional: true }], (something) => something.WRONG.id);
      const result2 = useSelector(
        [{ store, optional: true }] as const,
        // @ts-expect-error
        (something) => something.WRONG.id
      );

      return null;
    };
  });

  it('UNTYPED CASE! infer any store name from array of optional stores names argument, with and without const', () => {
    const Component = () => {
      const store = createReducer('test', { id: 1 });
      const result1 = useSelector(
        [{ store: 'test', optional: true }],
        (something) => something.WRONG.id
      );
      const result2 = useSelector(
        [{ store: 'test', optional: true }] as const,
        (something) => something.WRONG.id
      );

      return null;
    };
  });

  it('infer right type from array of different arguments only for stores or optional stores, only for const array', () => {
    const store1 = createReducer('test1', { id: 1 });
    const store2 = createReducer('test2', { id: '2' });
    const store3 = createReducer('test3', { id: true });
    const store4 = createReducer('test4', { id: [] });

    const result1 = useSelector(
      ['test1', store2, { store: store3, optional: true }, { store: 'store4', optional: true }],
      (something) => {
        return {
          1: something.test1.id,
          2: something.test2.id,
          3: something.test3.id,
          4: something.test4.id,
          5: something.WRONG.id,
        };
      }
    );

    const result2 = useSelector(
      [
        'test1',
        store2,
        { store: store3, optional: true },
        { store: 'store4', optional: true },
      ] as const,
      (something) => {
        return {
          1: something.test1.id,
          2: something.test2.id,
          3: something.test3.id,
          4: something.test4.id,
          5: something.WRONG.id,
        };
      }
    );

    const isNumber11: IsNumber<typeof result1[1]> = 1;
    const isAny11: IsAny<typeof result1[1]> = 1;
    const isString12: IsString<typeof result1[2]> = 1;
    const isAny12: IsAny<typeof result1[2]> = 1;
    const isBoolean13: IsBoolean<typeof result1[3]> = 1;
    const isAny13: IsAny<typeof result1[3]> = 1;
    const isArray14: IsArray<typeof result1[4]> = 1;
    const isAny14: IsAny<typeof result1[4]> = 1;

    const isNumber21: IsNumber<typeof result2[1]> = 1;
    const isAny21: IsAny<typeof result2[1]> = 1;
    const isString22: IsString<typeof result2[2]> = 1;
    // @ts-expect-error
    const isAny22: IsAny<typeof result2[2]> = 1;
    const isBoolean23: IsBoolean<typeof result2[3]> = 1;
    // @ts-expect-error
    const isAny23: IsAny<typeof result2[3]> = 1;
    const isArray24: IsArray<typeof result2[4]> = 1;
    const isAny24: IsAny<typeof result2[4]> = 1;
  });

  it('infer right store name from single legacy BaseStore argument', () => {
    const Component = () => {
      // @ts-expect-error
      const result = useSelector(MockStore, (something) => something.WRONG.id);

      return null;
    };
  });

  it('infer right result type from single legacy BaseStore argument', () => {
    const Component = () => {
      const result = useSelector(MockStore, (something) => something.test.id);

      const isNumber: IsNumber<typeof result> = 1;
      // @ts-expect-error
      const isAny: IsAny<typeof result> = 1;

      return null;
    };
  });

  it('infer right store name from list of legacy BaseStore arguments', () => {
    const Component = () => {
      // @ts-expect-error
      const result = useSelector([MockStore], (something) => something.WRONG.id);

      return null;
    };
  });

  it('infer right result type from list of legacy BaseStore arguments', () => {
    const Component = () => {
      const result = useSelector([MockStore], (something) => something.test.id);

      const isNumber: IsNumber<typeof result> = 1;
      // @ts-expect-error
      const isAny: IsAny<typeof result> = 1;

      return null;
    };
  });

  it('infer right store name from const list of legacy BaseStore arguments', () => {
    const Component = () => {
      // @ts-expect-error
      const result = useSelector([MockStore] as const, (something) => something.WRONG.id);

      return null;
    };
  });

  it('infer right result type from const list of legacy BaseStore arguments', () => {
    const Component = () => {
      const result = useSelector([MockStore] as const, (something) => something.test.id);

      const isNumber: IsNumber<typeof result> = 1;
      // @ts-expect-error
      const isAny: IsAny<typeof result> = 1;

      return null;
    };
  });
});
/* eslint-enable jest/expect-expect */
