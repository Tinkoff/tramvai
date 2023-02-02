import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import { CLOSE_HANDLER_TOKEN, INIT_HANDLER_TOKEN } from '../../tokens';
import {
  CONFIG_MANAGER_TOKEN,
  CONFIG_ENTRY_TOKEN,
  COMMAND_PARAMETERS_TOKEN,
  STATIC_SERVER_TOKEN,
} from '../../../../di/tokens';
import type { ConfigManager } from '../../../../config/configManager';
import { createConfigManager } from '../../../../config/configManager';
import { closeWorkerPoolTranspiler } from '../../../../library/webpack/utils/workersPool';
import { stopServer } from '../../utils/stopServer';
import { createServer } from '../../utils/createServer';
import { listenServer } from '../../utils/listenServer';
import type { ModuleConfigEntry } from '../../../../typings/configEntry/module';

export const sharedProviders: readonly Provider[] = [
  provide({
    provide: CONFIG_MANAGER_TOKEN,
    useFactory: ({ configEntry, parameters }) => {
      return createConfigManager(configEntry as ModuleConfigEntry, {
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
  }),
  provide({
    provide: STATIC_SERVER_TOKEN,
    useFactory: createServer,
  }),
  provide({
    provide: INIT_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ staticServer, parameters }) => {
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
  }),
  provide({
    provide: CLOSE_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ staticServer }) => {
      return () => {
        return stopServer(staticServer);
      };
    },
    deps: {
      staticServer: STATIC_SERVER_TOKEN,
    },
  }),
  provide({
    provide: CLOSE_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ configManager }) => {
      return async () => {
        closeWorkerPoolTranspiler(configManager);
      };
    },
    deps: {
      configManager: CONFIG_MANAGER_TOKEN,
    },
  }),
] as const;
