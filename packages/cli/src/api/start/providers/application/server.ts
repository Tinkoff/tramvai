import type { Provider } from '@tinkoff/dippy';
import { INIT_HANDLER_TOKEN, CLOSE_HANDLER_TOKEN } from '../../tokens';
import { COMMAND_PARAMETERS_TOKEN, SERVER_TOKEN } from '../../../../di/tokens';
import { stopServer } from '../../utils/stopServer';
import { createServer } from '../../utils/createServer';
import { listenServer } from '../../utils/listenServer';
import type { Params } from '../../index';

export const serverProviders: readonly Provider[] = [
  {
    provide: SERVER_TOKEN,
    useFactory: createServer,
  },
  {
    provide: INIT_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ server, parameters }: { server: typeof SERVER_TOKEN; parameters: Params }) => {
      return async function staticServerListen() {
        const { host = '0.0.0.0', port = 3000 } = parameters;

        try {
          await listenServer(server, host, port);
        } catch (error) {
          if ((error as any).code === 'EADDRINUSE') {
            throw new Error(
              `Address '${host}:${port}' in use, either release this port or use options --port --host`
            );
          }

          throw error;
        }
      };
    },
    deps: {
      server: SERVER_TOKEN,
      parameters: COMMAND_PARAMETERS_TOKEN,
    },
  },
  {
    provide: CLOSE_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ server }: { server: typeof SERVER_TOKEN }) => {
      return () => {
        return stopServer(server);
      };
    },
    deps: {
      server: SERVER_TOKEN,
    },
  },
] as const;
