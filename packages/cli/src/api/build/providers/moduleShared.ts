import type { Provider } from '@tinkoff/dippy';
import { webpack } from 'webpack';
import {
  CONFIG_MANAGER_TOKEN,
  COMMAND_PARAMETERS_TOKEN,
  CONFIG_ENTRY_TOKEN,
} from '../../../di/tokens';
import { ConfigManager } from '../../../config/configManager';
import type { ModuleConfigEntry } from '../../../typings/configEntry/module';
import type { Params } from '../index';
import {
  WEBPACK_CLIENT_CONFIG_TOKEN,
  WEBPACK_SERVER_CONFIG_TOKEN,
  WEBPACK_COMPILER_TOKEN,
  WEBPACK_CLIENT_COMPILER_TOKEN,
  WEBPACK_SERVER_COMPILER_TOKEN,
  CLOSE_HANDLER_TOKEN,
  PROCESS_HANDLER_TOKEN,
} from '../tokens';
import { toWebpackConfig } from '../../../library/webpack/utils/toWebpackConfig';
import { closeWebpack } from '../utils/closeWebpack';
import { runWebpack } from '../utils/runWebpack';

export const sharedProviders: readonly Provider[] = [
  {
    provide: CONFIG_MANAGER_TOKEN,
    useFactory: ({
      configEntry,
      parameters,
    }: {
      configEntry: ModuleConfigEntry;
      parameters: Params;
    }) => {
      return new ConfigManager(configEntry, {
        ...parameters,
        env: 'production',
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
    provide: PROCESS_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ webpackCompiler }: { webpackCompiler: typeof WEBPACK_COMPILER_TOKEN }) => {
      return function webpackBuild() {
        return runWebpack(webpackCompiler);
      };
    },
    deps: {
      webpackCompiler: WEBPACK_COMPILER_TOKEN,
    },
  },
  {
    provide: CLOSE_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ webpackCompiler }: { webpackCompiler: typeof WEBPACK_COMPILER_TOKEN }) => {
      return function webpackClose() {
        return closeWebpack(webpackCompiler);
      };
    },
    deps: {
      webpackCompiler: WEBPACK_COMPILER_TOKEN,
    },
  },
];
