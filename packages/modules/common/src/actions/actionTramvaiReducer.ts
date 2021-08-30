import { createReducer, createEvent } from '@tramvai/state';

const actionServerStateEvent = createEvent<Record<string, boolean>>(
  'action state execution in server'
);

const initalState = { serverState: {} };

const actionTramvaiReducer = createReducer('actionTramvai', initalState).on(
  actionServerStateEvent,
  (state, payload) => ({
    ...state,
    serverState: payload,
  })
);

export { actionTramvaiReducer, actionServerStateEvent };
