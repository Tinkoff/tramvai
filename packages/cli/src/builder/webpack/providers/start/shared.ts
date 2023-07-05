import type { Provider } from '@tinkoff/dippy';
import { DI_TOKEN, provide } from '@tinkoff/dippy';
import webpack from 'webpack';
import { toWebpackConfig } from '../../../../library/webpack/utils/toWebpackConfig';
import {
  PROCESS_HANDLER_TOKEN,
  WEBPACK_CLIENT_COMPILER_TOKEN,
  WEBPACK_CLIENT_CONFIG_TOKEN,
  WEBPACK_COMPILER_TOKEN,
  WEBPACK_SERVER_COMPILER_TOKEN,
  WEBPACK_SERVER_CONFIG_TOKEN,
} from '../../tokens';
import { createDevServer } from '../../devServer/setup';
import { CONFIG_MANAGER_TOKEN, STATIC_SERVER_TOKEN } from '../../../../di/tokens';

export const startSharedProviders: Provider[] = [
  provide({
    provide: WEBPACK_COMPILER_TOKEN,
    useFactory: ({ clientConfig, serverConfig }) => {
      const configs = [clientConfig, serverConfig].filter(Boolean).map(toWebpackConfig);

      return webpack(configs);
    },
    deps: {
      clientConfig: { token: WEBPACK_CLIENT_CONFIG_TOKEN, optional: true },
      serverConfig: { token: WEBPACK_SERVER_CONFIG_TOKEN, optional: true },
    },
  }),
  provide({
    provide: WEBPACK_CLIENT_COMPILER_TOKEN,
    useFactory: ({ compiler, clientConfig }) => {
      if (clientConfig) {
        return compiler.compilers[0];
      }
    },
    deps: {
      compiler: WEBPACK_COMPILER_TOKEN,
      clientConfig: { token: WEBPACK_CLIENT_CONFIG_TOKEN, optional: true },
    },
  }),
  provide({
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
  }),
  provide({
    provide: PROCESS_HANDLER_TOKEN,
    multi: true,
    useFactory: createDevServer,
    deps: {
      di: DI_TOKEN,
      compiler: WEBPACK_COMPILER_TOKEN,
      configManager: CONFIG_MANAGER_TOKEN,
      staticServer: STATIC_SERVER_TOKEN,
    },
  }),
];
