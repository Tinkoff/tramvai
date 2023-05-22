import { createEvent, createReducer } from '@tramvai/state';

interface State {
  value: string;
}

export const setRootStoreValue = createEvent<string>('setRootStoreValue');

export const rootStore = createReducer('root', { value: 'root' } as State).on(
  setRootStoreValue,
  (_, value) => {
    return {
      value,
    };
  }
);
