import type { Provider } from '@tinkoff/dippy';
import rimraf from 'rimraf';
import { webpack } from 'webpack';
import {
  SERVER_CONFIG_MANAGER_TOKEN,
  WEBPACK_SERVER_CONFIG_TOKEN,
  INIT_HANDLER_TOKEN,
  WEBPACK_SERVER_COMPILER_TOKEN,
  PROCESS_HANDLER_TOKEN,
  CLOSE_HANDLER_TOKEN,
} from '../tokens';
import { CONFIG_MANAGER_TOKEN } from '../../../di/tokens';
import { webpackServerConfig } from '../../../library/webpack/application/server/prod';

import { toWebpackConfig } from '../../../library/webpack/utils/toWebpackConfig';
import { runWebpack } from '../utils/runWebpack';
import { closeWebpack } from '../utils/closeWebpack';
import { copyStatsJsonFileToServerDirectory } from '../utils/copyStatsJsonFile';

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
    provide: WEBPACK_SERVER_CONFIG_TOKEN,
    useFactory: webpackServerConfig,
    deps: {
      configManager: SERVER_CONFIG_MANAGER_TOKEN,
    },
  },
  {
    provide: INIT_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ configManager }: { configManager: typeof CONFIG_MANAGER_TOKEN }) => {
      return function clearBuildDir() {
        return rimraf.sync(`${configManager.getBuildPath()}/**`, {});
      };
    },
    deps: {
      configManager: SERVER_CONFIG_MANAGER_TOKEN,
    },
  },
  {
    provide: WEBPACK_SERVER_COMPILER_TOKEN,
    useFactory: ({ webpackConfig }: { webpackConfig: typeof WEBPACK_SERVER_CONFIG_TOKEN }) => {
      return webpack(toWebpackConfig(webpackConfig));
    },
    deps: {
      webpackConfig: WEBPACK_SERVER_CONFIG_TOKEN,
    },
  },
  {
    provide: PROCESS_HANDLER_TOKEN,
    multi: true,
    useFactory: ({
      webpackCompiler,
    }: {
      webpackCompiler: typeof WEBPACK_SERVER_COMPILER_TOKEN;
    }) => {
      return function webpackBuild() {
        return runWebpack(webpackCompiler);
      };
    },
    deps: {
      webpackCompiler: WEBPACK_SERVER_COMPILER_TOKEN,
    },
  },
  {
    provide: CLOSE_HANDLER_TOKEN,
    multi: true,
    useFactory: ({
      webpackCompiler,
    }: {
      webpackCompiler: typeof WEBPACK_SERVER_COMPILER_TOKEN;
    }) => {
      return function webpackClose() {
        return closeWebpack(webpackCompiler);
      };
    },
    deps: {
      webpackCompiler: WEBPACK_SERVER_COMPILER_TOKEN,
    },
  },
  {
    provide: CLOSE_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ configManager }: { configManager: typeof CONFIG_MANAGER_TOKEN }) => {
      return async function copyStatsFiles() {
        return copyStatsJsonFileToServerDirectory(configManager);
      };
    },
    deps: {
      configManager: CONFIG_MANAGER_TOKEN,
    },
  },
];
