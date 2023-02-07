import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';

import { INIT_HANDLER_TOKEN, CLOSE_HANDLER_TOKEN } from '../../tokens';
import { CONFIG_MANAGER_TOKEN, SERVER_TOKEN } from '../../../../di/tokens';
import { stopServer } from '../../utils/stopServer';
import { createServer } from '../../utils/createServer';
import { listenServer } from '../../utils/listenServer';

export const serverProviders: readonly Provider[] = [
  provide({
    provide: SERVER_TOKEN,
    useFactory: createServer,
  }),
  provide({
    provide: INIT_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ server, configManager }) => {
      return async function staticServerListen() {
        const { host, port } = configManager;

        await listenServer(server, host, port);
      };
    },
    deps: {
      server: SERVER_TOKEN,
      configManager: CONFIG_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: CLOSE_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ server }) => {
      return () => {
        return stopServer(server);
      };
    },
    deps: {
      server: SERVER_TOKEN,
    },
  }),
] as const;
