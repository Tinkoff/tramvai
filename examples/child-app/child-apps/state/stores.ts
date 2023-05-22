import { createReducer, createEvent } from '@tramvai/state';

export const updateTestEvent = createEvent<string>('child-test update');

interface State {
  value: string;
}
export const testStore = createReducer('child-test', { value: 'initial' } as State).on(
  updateTestEvent,
  (state, value) => {
    return {
      value,
    };
  }
);
