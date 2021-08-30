import type { Provider } from '@tinkoff/dippy';
import { DI_TOKEN } from '@tinkoff/dippy';
import {
  INIT_HANDLER_TOKEN,
  WEBPACK_SERVER_CONFIG_TOKEN,
  SERVER_TOKEN,
  WEBPACK_COMPILER_TOKEN,
  CLOSE_HANDLER_TOKEN,
  SERVER_CONFIG_MANAGER_TOKEN,
  PROCESS_HANDLER_TOKEN,
} from '../tokens';
import {
  CONFIG_MANAGER_TOKEN,
  UI_SHOW_PROGRESS_TOKEN,
  COMMAND_PARAMETERS_TOKEN,
} from '../../../di/tokens';
import { webpackServerConfig } from '../../../library/webpack/application/server/dev';
import { serverRunner } from '../devServer/serverRunner';
import { stopServer } from '../utils/stopServer';
import { createServer } from '../utils/createServer';
import { listenServer } from '../utils/listenServer';
import type { Params } from '../index';

export const serverProviders: readonly Provider[] = [
  {
    provide: SERVER_CONFIG_MANAGER_TOKEN,
    useFactory: ({ configManager }: { configManager: typeof CONFIG_MANAGER_TOKEN }) => {
      return configManager.withSettings({
        buildType: 'server',
      });
    },
    deps: {
      configManager: CONFIG_MANAGER_TOKEN,
    },
  },
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
    provide: WEBPACK_SERVER_CONFIG_TOKEN,
    useFactory: webpackServerConfig,
    deps: {
      configManager: SERVER_CONFIG_MANAGER_TOKEN,
      showProgress: { token: UI_SHOW_PROGRESS_TOKEN, optional: true },
    },
  },
  {
    provide: PROCESS_HANDLER_TOKEN,
    multi: true,
    useFactory: serverRunner,
    deps: {
      di: DI_TOKEN,
      config: WEBPACK_SERVER_CONFIG_TOKEN,
      compiler: WEBPACK_COMPILER_TOKEN,
      configManager: SERVER_CONFIG_MANAGER_TOKEN,
      server: SERVER_TOKEN,
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
