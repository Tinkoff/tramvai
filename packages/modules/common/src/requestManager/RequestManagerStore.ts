import { createReducer, createEvent } from '@tramvai/state';

type Request = Record<string, any>;

export const setRequest = createEvent<Request>('setRequest');

export const RequestManagerStore = createReducer<Request, 'requestManager'>(
  'requestManager',
  {}
).on(setRequest, (_, state) => {
  return state;
});
