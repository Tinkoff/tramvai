import { expectTypeOf } from 'expect-type';
import type { Event } from '@tramvai/types-actions-state-context';
import { createReducer } from './createReducer';

it('events', async () => {
  const testReducer = createReducer({
    name: 'test',
    initialState: { a: 2 },
    events: {
      testEvent1: (state, val: string) => {
        expectTypeOf(state).toEqualTypeOf<{ a: number }>();
        return state;
      },
      testEvent2: (state) => state,
      testEvent3: (state, val: { b: boolean }) => state,
    },
  });

  const { testEvent1, testEvent2, testEvent3 } = testReducer.events;

  expectTypeOf(testEvent1).parameters.toEqualTypeOf<[string]>();
  expectTypeOf(testEvent2).parameters.toEqualTypeOf<[]>();
  expectTypeOf(testEvent3).parameters.toEqualTypeOf<[{ b: boolean }]>();

  expectTypeOf(testEvent1).returns.toEqualTypeOf<Event<string>>();
  expectTypeOf(testEvent2).returns.toEqualTypeOf<Event<void>>();
  expectTypeOf(testEvent3).returns.toEqualTypeOf<Event<{ b: boolean }>>();
});
