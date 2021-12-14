import { createToken } from '@tinkoff/dippy';

export const INITIAL_APP_STATE_TOKEN = createToken<{ stores: Record<string, any> }>(
  'initialAppState'
);
