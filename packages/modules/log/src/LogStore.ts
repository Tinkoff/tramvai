import { createReducer, createEvent } from '@tramvai/state';

export const setLogs = createEvent<any[]>('setLogs');

export const LogStore = createReducer('devLogs', []).on(setLogs, (_, logs) => logs);
