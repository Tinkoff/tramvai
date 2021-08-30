import type { Provider } from '@tinkoff/dippy';
import { webpack } from 'webpack';
import {
  CLIENT_MODERN_CONFIG_MANAGER_TOKEN,
  WEBPACK_CLIENT_MODERN_CONFIG_TOKEN,
  PROCESS_HANDLER_TOKEN,
  WEBPACK_CLIENT_MODERN_COMPILER_TOKEN,
  CLOSE_HANDLER_TOKEN,
} from '../tokens';
import { CONFIG_MANAGER_TOKEN } from '../../../di/tokens';
import { webpackClientConfig } from '../../../library/webpack/application/client/prod';
import type { Params } from '../index';
import { toWebpackConfig } from '../../../library/webpack/utils/toWebpackConfig';
import { runWebpack } from '../utils/runWebpack';
import { closeWebpack } from '../utils/closeWebpack';

export const clientModernProviders: readonly Provider[] = [
  {
    provide: CLIENT_MODERN_CONFIG_MANAGER_TOKEN,
    useFactory: ({
      configManager,
    }: {
      configManager: typeof CONFIG_MANAGER_TOKEN;
      parameters: Params;
    }) => {
      return configManager.withSettings({
        buildType: 'client',
        modern: true,
      });
    },
    deps: {
      configManager: CONFIG_MANAGER_TOKEN,
    },
  },
  {
    provide: WEBPACK_CLIENT_MODERN_CONFIG_TOKEN,
    useFactory: webpackClientConfig,
    deps: {
      configManager: CLIENT_MODERN_CONFIG_MANAGER_TOKEN,
    },
  },
  {
    provide: WEBPACK_CLIENT_MODERN_COMPILER_TOKEN,
    useFactory: ({
      webpackConfig,
    }: {
      webpackConfig: typeof WEBPACK_CLIENT_MODERN_CONFIG_TOKEN;
    }) => {
      return webpack(toWebpackConfig(webpackConfig));
    },
    deps: {
      webpackConfig: WEBPACK_CLIENT_MODERN_CONFIG_TOKEN,
    },
  },
  {
    provide: PROCESS_HANDLER_TOKEN,
    multi: true,
    useFactory: ({
      webpackCompiler,
    }: {
      webpackCompiler: typeof WEBPACK_CLIENT_MODERN_COMPILER_TOKEN;
    }) => {
      return function webpackBuild() {
        return runWebpack(webpackCompiler);
      };
    },
    deps: {
      webpackCompiler: WEBPACK_CLIENT_MODERN_COMPILER_TOKEN,
    },
  },
  {
    provide: CLOSE_HANDLER_TOKEN,
    multi: true,
    useFactory: ({
      webpackCompiler,
    }: {
      webpackCompiler: typeof WEBPACK_CLIENT_MODERN_COMPILER_TOKEN;
    }) => {
      return function webpackClose() {
        return closeWebpack(webpackCompiler);
      };
    },
    deps: {
      webpackCompiler: WEBPACK_CLIENT_MODERN_COMPILER_TOKEN,
    },
  },
] as const;
