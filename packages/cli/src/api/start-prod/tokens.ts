import { createToken } from '@tinkoff/dippy';
import type { ChildProcess } from 'child_process';

export const INIT_HANDLER_TOKEN = createToken<() => Promise<void> | void>(
  'start-prod initHandler',
  {
    multi: true,
  }
);

export const PROCESS_HANDLER_TOKEN = createToken<() => Promise<void> | void>(
  'start-prod processHandler',
  {
    multi: true,
  }
);
export const CLOSE_HANDLER_TOKEN = createToken<() => Promise<void> | void>(
  'start-prod closeHandler',
  {
    multi: true,
  }
);

export const SERVER_PROCESS_TOKEN = createToken<ChildProcess>('start-prod serverProcess');
