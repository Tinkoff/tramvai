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
} from '../tokens';
import { moduleDevServer } from '../devServer/module';
import {
  CONFIG_MANAGER_TOKEN,
  CONFIG_ENTRY_TOKEN,
  COMMAND_PARAMETERS_TOKEN,
} from '../../../di/tokens';
import type { ApplicationConfigEntry } from '../../../typings/configEntry/application';
import type { Params } from '../index';
import { ConfigManager } from '../../../config/configManager';
import {
  closeWorkerPoolBabel,
  closeWorkerPoolStyles,
} from '../../../library/webpack/utils/workersPool';
import { toWebpackConfig } from '../../../library/webpack/utils/toWebpackConfig';
import { stopServer } from '../utils/stopServer';
import { createServer } from '../utils/createServer';
import { listenServer } from '../utils/listenServer';

export const sharedProviders: readonly Provider[] = [
  {
    provide: CONFIG_MANAGER_TOKEN,
    useFactory: ({
      configEntry,
      parameters,
    }: {
      configEntry: ApplicationConfigEntry;
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
    provide: PROCESS_HANDLER_TOKEN,
    multi: true,
    useFactory: moduleDevServer,
    deps: {
      di: DI_TOKEN,
      compiler: WEBPACK_COMPILER_TOKEN,
      configManager: CONFIG_MANAGER_TOKEN,
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
