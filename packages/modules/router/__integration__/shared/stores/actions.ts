import { createEvent, createReducer } from '@tramvai/state';

export const setAction = createEvent<{ name: string; payload?: any }>('setAction');

export const ActionsStore = createReducer('actions', {}).on(
  setAction,
  (state, { name, payload }) => {
    return {
      ...state,
      [name]: payload ?? true,
    };
  }
);
