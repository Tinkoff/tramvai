import { createReducer, createEvent } from '@tramvai/state';

interface State {
  value: string;
}
export const setRootState = createEvent<string>('child-root set state');

export const rootStore = createReducer('child-root', { value: 'child' } as State).on(
  setRootState,
  (state, value) => {
    return { value };
  }
);
