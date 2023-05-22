import { createReducer, createEvent } from '@tramvai/state';
import type { commandLineListTokens } from '@tramvai/child-app-core';

type LineKeys = keyof typeof commandLineListTokens;

export const pushLineEvent = createEvent<LineKeys>('child-app push line');

interface State {
  lastLines: LineKeys[];
}

export const CommandLinesStore = createReducer('child-app command line', {
  lastLines: [],
} as State).on(pushLineEvent, (state, line) => {
  return {
    ...state,
    lastLines: [...state.lastLines, line].slice(-8, Infinity),
  };
});
