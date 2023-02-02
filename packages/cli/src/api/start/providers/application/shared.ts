import type { Provider } from '@tinkoff/dippy';
import { CLOSE_HANDLER_TOKEN, INIT_HANDLER_TOKEN } from '../../tokens';
import {
  CONFIG_MANAGER_TOKEN,
  CONFIG_ENTRY_TOKEN,
  COMMAND_PARAMETERS_TOKEN,
  SERVER_TOKEN,
  STATIC_SERVER_TOKEN,
} from '../../../../di/tokens';
import { stopServer } from '../../utils/stopServer';
import type { ApplicationConfigEntry } from '../../../../typings/configEntry/application';
import type { Params } from '../../index';
import { createConfigManager } from '../../../../config/configManager';
import { createServer } from '../../utils/createServer';
import { listenServer } from '../../utils/listenServer';
import { getListeningPort } from '../../utils/getListeningPort';

export const sharedProviders: readonly Provider[] = [
  {
    provide: CONFIG_MANAGER_TOKEN,
    useFactory: ({
      configEntry,
      parameters,
      server,
      staticServer,
    }: {
      configEntry: ApplicationConfigEntry;
      parameters: Params;
      server: typeof SERVER_TOKEN;
      staticServer: typeof STATIC_SERVER_TOKEN;
    }) => {
      return createConfigManager(configEntry, {
        ...parameters,
        env: 'development',
        buildType: 'client',
        port: server ? getListeningPort(server) : parameters.port,
        staticPort: getListeningPort(staticServer),
      });
    },
    deps: {
      configEntry: CONFIG_ENTRY_TOKEN,
      parameters: COMMAND_PARAMETERS_TOKEN,
      staticServer: STATIC_SERVER_TOKEN,
      server: { token: SERVER_TOKEN, optional: true },
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
        const { staticHost = 'localhost', staticPort = 4000 } = parameters;

        try {
          await listenServer(staticServer, staticHost.replace('localhost', '0.0.0.0'), staticPort);
        } catch (error) {
          if ((error as any).code === 'EADDRINUSE') {
            throw new Error(
              `Address '${staticHost}:${staticPort}' in use, either release this port or use options --staticPort --staticHost`
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
] as const;
