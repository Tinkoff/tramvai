import { createReducer, createEvent } from '@tramvai/state';

export const set = createEvent<string>('actionSet');

export const store = createReducer('actionTest', {}).on(set, (state, name) => {
  return {
    ...state,
    [name]: typeof window === 'undefined' ? 'server' : 'client',
  };
});
