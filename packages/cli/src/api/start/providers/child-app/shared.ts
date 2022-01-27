import type { Provider } from '@tinkoff/dippy';
import { CLOSE_HANDLER_TOKEN, INIT_HANDLER_TOKEN } from '../../tokens';
import {
  CONFIG_MANAGER_TOKEN,
  CONFIG_ENTRY_TOKEN,
  COMMAND_PARAMETERS_TOKEN,
  STATIC_SERVER_TOKEN,
} from '../../../../di/tokens';
import type { ChildAppConfigEntry } from '../../../../typings/configEntry/child-app';
import type { Params } from '../../index';
import { ConfigManager } from '../../../../config/configManager';
import {
  closeWorkerPoolBabel,
  closeWorkerPoolStyles,
} from '../../../../library/webpack/utils/workersPool';
import { stopServer } from '../../utils/stopServer';
import { createServer } from '../../utils/createServer';
import { listenServer } from '../../utils/listenServer';

export const sharedProviders: readonly Provider[] = [
  {
    provide: CONFIG_MANAGER_TOKEN,
    useFactory: ({
      configEntry,
      parameters,
    }: {
      configEntry: ChildAppConfigEntry;
      parameters: Params;
    }) => {
      return new ConfigManager(configEntry, {
        ...parameters,
        env: 'development',
        port: parameters.port ?? 4040,
        buildType: 'client',
      });
    },
    deps: {
      configEntry: CONFIG_ENTRY_TOKEN,
      parameters: COMMAND_PARAMETERS_TOKEN,
    },
  },
  {
    provide: STATIC_SERVER_TOKEN,
    useFactory: createServer,
  },
  {
    provide: INIT_HANDLER_TOKEN,
    multi: true,
    useFactory: ({
      staticServer,
      parameters,
    }: {
      staticServer: typeof STATIC_SERVER_TOKEN;
      parameters: Params;
    }) => {
      return async function staticServerListen() {
        const { host = 'localhost', port = 4040 } = parameters;

        try {
          await listenServer(staticServer, host, port);
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
      staticServer: STATIC_SERVER_TOKEN,
      parameters: COMMAND_PARAMETERS_TOKEN,
    },
  },
  {
    provide: CLOSE_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ staticServer }: { staticServer: typeof STATIC_SERVER_TOKEN }) => {
      return () => {
        return stopServer(staticServer);
      };
    },
    deps: {
      staticServer: STATIC_SERVER_TOKEN,
    },
  },
  {
    provide: CLOSE_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ configManager }: { configManager: typeof CONFIG_MANAGER_TOKEN }) => {
      return async () => {
        await Promise.all([
          closeWorkerPoolBabel(configManager),
          closeWorkerPoolStyles(configManager),
        ]);
      };
    },
    deps: {
      configManager: CONFIG_MANAGER_TOKEN,
    },
  },
] as const;
