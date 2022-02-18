import React, { useCallback } from 'react';
import { createAction, createBundle } from '@tramvai/core';
import { ChildApp } from '@tramvai/module-child-app';
import { useConsumerContext, useStore } from '@tramvai/state';
import { createEvent, createReducer } from '@tramvai/state';

interface State {
  value: number;
}

export const increaseValue = createEvent<void>('increaseValue');

export const rootStore = createReducer('root', { value: 0 } as State).on(increaseValue, (state) => {
  return {
    value: state.value + 1,
  };
});

export const updateRootValueAction = createAction({
  name: 'root-app-store',
  fn: async (context) => {
    return context.dispatch(increaseValue());
  },
  conditions: {
    onlyServer: true,
  },
});

const Cmp = () => {
  const context = useConsumerContext();
  const state = useStore(rootStore);

  const cb = useCallback(() => {
    context.dispatch(increaseValue());
  }, [context]);

  return (
    <>
      <h2>Root</h2>
      <div>Content from root, state: {state.value}</div>
      <button id="button" type="button" onClick={cb}>
        Update Root State
      </button>
      <h3>Child</h3>
      <ChildApp name="state" />
    </>
  );
};

Cmp.childApps = [{ name: 'state' }];

// eslint-disable-next-line import/no-default-export
export default createBundle({
  name: 'state',
  components: {
    pageDefault: Cmp,
  },
  reducers: [rootStore],
  actions: [updateRootValueAction],
});
