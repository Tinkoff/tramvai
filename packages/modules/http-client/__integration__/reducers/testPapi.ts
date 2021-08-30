import { createEvent, createReducer } from '@tramvai/state';

export const updateTestPapiState = createEvent<any[]>('updateTestPapiState');

export const testPapiReducer = createReducer('testPapi', []).on(
  updateTestPapiState,
  (state, payload) => payload
);
