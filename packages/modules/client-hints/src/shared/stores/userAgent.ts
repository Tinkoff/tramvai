import { createReducer, createEvent } from '@tramvai/state';
import type { UserAgent } from '@tinkoff/user-agent';

export const setUserAgent = createEvent<UserAgent>('setUserAgent');

export const UserAgentStore = createReducer<UserAgent, 'userAgent'>('userAgent', null as any).on(
  setUserAgent,
  (state, userAgent) => userAgent
);
