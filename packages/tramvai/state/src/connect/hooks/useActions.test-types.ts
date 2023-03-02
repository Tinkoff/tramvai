import { expectTypeOf } from 'expect-type';
import { createAction, declareAction } from '@tramvai/core';
import { useActions } from './useActions';
import { createEvent } from '../../createEvent/createEvent';

describe('useActions.test-types', () => {
  describe('modern actions', () => {
    it('single action', async () => {
      const action = declareAction({ name: 'test', fn: (arg1: string, arg2: number) => 5 });

      const hookAction = useActions(action);

      expectTypeOf(hookAction).returns.resolves.toBeNumber();
      expectTypeOf(hookAction).parameters.toEqualTypeOf<[string, number]>();
    });

    it('multiple actions', async () => {
      const action1 = declareAction({ name: 'test', fn: (arg: string) => 5 });
      const action2 = declareAction({ name: 'test2', fn: (arg: { a: number }) => {} });

      const [hookAction1, hookAction2] = useActions([action1, action2]);

      expectTypeOf(hookAction1).returns.resolves.toBeAny();
      expectTypeOf(hookAction1).parameters.items.toBeAny();

      expectTypeOf(hookAction2).returns.resolves.toBeAny();
      expectTypeOf(hookAction2).parameters.items.toBeAny();
    });

    it('multiple actions as const', async () => {
      const action1 = declareAction({ name: 'test', fn: (arg1: string, arg2: number) => 5 });
      const action2 = declareAction({ name: 'test2', fn: () => 'test' });
      const action3 = declareAction({ name: 'test3', fn: (arg: { a: number }) => {} });

      const [hookAction1, hookAction2, hookAction3] = useActions([
        action1,
        action2,
        action3,
      ] as const);

      expectTypeOf(hookAction1).returns.resolves.toBeNumber();
      expectTypeOf(hookAction1).parameters.toEqualTypeOf<[string, number]>();

      expectTypeOf(hookAction2).returns.resolves.toBeString();
      expectTypeOf(hookAction2).parameters.toEqualTypeOf<[]>();

      expectTypeOf(hookAction3).returns.resolves.toBeVoid();
      expectTypeOf(hookAction3).parameters.toEqualTypeOf<[{ a: number }]>();
    });
  });
  describe('legacy actions', () => {
    it('single action', async () => {
      const action = createAction({ name: 'test', fn: (_, arg: string) => 5 });

      const hookAction = useActions(action);

      expectTypeOf(hookAction).returns.resolves.toBeNumber();
      expectTypeOf(hookAction).parameter(0).toEqualTypeOf<string | undefined>();
      expectTypeOf(hookAction).parameter(1).toBeUndefined();
    });

    it('multiple actions', async () => {
      const action1 = createAction({ name: 'test', fn: (_, arg: string) => 5 });
      const action2 = createAction({ name: 'test2', fn: (_, arg: { a: number }) => {} });

      const [hookAction1, hookAction2] = useActions([action1, action2]);

      expectTypeOf(hookAction1).returns.resolves.toBeAny();
      expectTypeOf(hookAction1).parameter(0).toBeAny();
      expectTypeOf(hookAction1).parameter(1).toBeUndefined();

      expectTypeOf(hookAction2).returns.resolves.toBeAny();
      expectTypeOf(hookAction2).parameter(0).toBeAny();
      expectTypeOf(hookAction2).parameter(1).toBeUndefined();
    });

    it('multiple actions as const', async () => {
      const action1 = createAction({ name: 'test', fn: (_, arg: string) => 5 });
      const action2 = createAction({ name: 'test2', fn: (_, arg: { a: number }) => {} });

      const [hookAction1, hookAction2] = useActions([action1, action2] as const);

      expectTypeOf(hookAction1).returns.resolves.toBeNumber();
      expectTypeOf(hookAction1).parameter(0).toEqualTypeOf<string | undefined>();
      expectTypeOf(hookAction1).parameter(1).toBeUndefined();

      expectTypeOf(hookAction2).returns.resolves.toBeVoid();
      expectTypeOf(hookAction2).parameter(0).toEqualTypeOf<{ a: number } | undefined>();
      expectTypeOf(hookAction2).parameter(1).toBeUndefined();
    });
  });

  describe('error usage', () => {
    it('passing not actions', () => {
      const event = createEvent('test');
      const fn = () => {};

      // @ts-expect-error
      useActions(event);

      // @ts-expect-error
      useActions(fn);

      // @ts-expect-error
      useActions([event, fn]);
    });
  });
});
