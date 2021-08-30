import { createReducer, createEvent } from '@tramvai/state';

export const set = createEvent<{ name: string; value: any }>('actionSet');

export const store = createReducer('actionTest', {}).on(set, (state, { name, value }) => {
  return {
    ...state,
    [name]: value,
  };
});
