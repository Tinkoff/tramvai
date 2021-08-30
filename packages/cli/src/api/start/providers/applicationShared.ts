import type { Provider } from '@tinkoff/dippy';
import { DI_TOKEN } from '@tinkoff/dippy';
import webpack from 'webpack';
import {
  WEBPACK_COMPILER_TOKEN,
  WEBPACK_CLIENT_CONFIG_TOKEN,
  WEBPACK_SERVER_CONFIG_TOKEN,
  WEBPACK_CLIENT_COMPILER_TOKEN,
  WEBPACK_SERVER_COMPILER_TOKEN,
  STATIC_SERVER_TOKEN,
  CLOSE_HANDLER_TOKEN,
  INIT_HANDLER_TOKEN,
  PROCESS_HANDLER_TOKEN,
  SERVER_TOKEN,
} from '../tokens';
import { applicationDevServer } from '../devServer/application';
import {
  CONFIG_MANAGER_TOKEN,
  CONFIG_ENTRY_TOKEN,
  COMMAND_PARAMETERS_TOKEN,
} from '../../../di/tokens';
import { stopServer } from '../utils/stopServer';
import type { ApplicationConfigEntry } from '../../../typings/configEntry/application';
import type { Params } from '../index';
import { ConfigManager } from '../../../config/configManager';
import {
  closeWorkerPoolBabel,
  closeWorkerPoolStyles,
} from '../../../library/webpack/utils/workersPool';
import { toWebpackConfig } from '../../../library/webpack/utils/toWebpackConfig';
import { createServer } from '../utils/createServer';
import { listenServer } from '../utils/listenServer';
import { getListeningPort } from '../utils/getListeningPort';

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
      return new ConfigManager(configEntry, {
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
    provide: WEBPACK_COMPILER_TOKEN,
    deps: {
      clientConfig: { token: WEBPACK_CLIENT_CONFIG_TOKEN, optional: true },
      serverConfig: { token: WEBPACK_SERVER_CONFIG_TOKEN, optional: true },
    },
    useFactory: ({
      clientConfig,
      serverConfig,
    }: {
      clientConfig: typeof WEBPACK_CLIENT_CONFIG_TOKEN;
      serverConfig: typeof WEBPACK_SERVER_CONFIG_TOKEN;
    }) => {
      const configs = [clientConfig, serverConfig].filter(Boolean).map(toWebpackConfig);

      return webpack(configs);
    },
  },
  {
    provide: WEBPACK_CLIENT_COMPILER_TOKEN,
    useFactory: ({
      compiler,
      clientConfig,
    }: {
      compiler: typeof WEBPACK_COMPILER_TOKEN;
      clientConfig: typeof WEBPACK_CLIENT_CONFIG_TOKEN | null;
    }) => {
      if (clientConfig) {
        return compiler.compilers[0];
      }
    },
    deps: {
      compiler: WEBPACK_COMPILER_TOKEN,
      clientConfig: { token: WEBPACK_CLIENT_CONFIG_TOKEN, optional: true },
    },
  },
  {
    provide: WEBPACK_SERVER_COMPILER_TOKEN,
    useFactory: ({
      compiler,
      clientConfig,
      serverConfig,
    }: {
      compiler: typeof WEBPACK_COMPILER_TOKEN;
      clientConfig: typeof WEBPACK_SERVER_CONFIG_TOKEN | null;
      serverConfig: typeof WEBPACK_SERVER_CONFIG_TOKEN | null;
    }) => {
      if (serverConfig) {
        if (clientConfig) {
          return compiler.compilers[1];
        }

        return compiler.compilers[0];
      }
    },
    deps: {
      compiler: WEBPACK_COMPILER_TOKEN,
      clientConfig: { token: WEBPACK_CLIENT_CONFIG_TOKEN, optional: true },
      serverConfig: { token: WEBPACK_SERVER_CONFIG_TOKEN, optional: true },
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
    provide: PROCESS_HANDLER_TOKEN,
    multi: true,
    useFactory: applicationDevServer,
    deps: {
      di: DI_TOKEN,
      compiler: WEBPACK_COMPILER_TOKEN,
      configManager: CONFIG_MANAGER_TOKEN,
      clientConfig: { token: WEBPACK_CLIENT_CONFIG_TOKEN, optional: true },
      staticServer: STATIC_SERVER_TOKEN,
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
