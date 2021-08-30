import type { Provider } from '@tinkoff/dippy';
import rimraf from 'rimraf';
import webpack from 'webpack';
import {
  CLIENT_CONFIG_MANAGER_TOKEN,
  WEBPACK_CLIENT_CONFIG_TOKEN,
  INIT_HANDLER_TOKEN,
  WEBPACK_CLIENT_COMPILER_TOKEN,
  PROCESS_HANDLER_TOKEN,
  CLOSE_HANDLER_TOKEN,
} from '../tokens';
import { CONFIG_MANAGER_TOKEN, CLI_ROOT_DIR_TOKEN, CLI_PACKAGE_MANAGER } from '../../../di/tokens';
import { webpackClientConfig } from '../../../library/webpack/application/client/prod';
import { toWebpackConfig } from '../../../library/webpack/utils/toWebpackConfig';
import { runWebpack } from '../utils/runWebpack';
import { closeWebpack } from '../utils/closeWebpack';
import { npmRequire } from '../../../utils/npmRequire';

export const clientProviders: readonly Provider[] = [
  {
    provide: CLIENT_CONFIG_MANAGER_TOKEN,
    useFactory: ({ configManager }: { configManager: typeof CONFIG_MANAGER_TOKEN }) => {
      return configManager.withSettings({
        buildType: 'client',
        modern: false,
      });
    },
    deps: {
      configManager: CONFIG_MANAGER_TOKEN,
    },
  },
  {
    provide: WEBPACK_CLIENT_CONFIG_TOKEN,
    useFactory: webpackClientConfig,
    deps: {
      configManager: CLIENT_CONFIG_MANAGER_TOKEN,
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
      configManager: CLIENT_CONFIG_MANAGER_TOKEN,
    },
  },
  {
    provide: INIT_HANDLER_TOKEN,
    multi: true,
    useFactory: ({
      configManager,
      cliRootDir,
      packageManager,
    }: {
      configManager: typeof CLIENT_CONFIG_MANAGER_TOKEN;
      cliRootDir: typeof CLI_ROOT_DIR_TOKEN;
      packageManager: typeof CLI_PACKAGE_MANAGER;
    }) => {
      return async function prepareImageOptimization() {
        if (configManager.build?.configurations?.imageOptimization?.enabled) {
          await npmRequire({
            cliRootDir,
            packageManager,
            packageName: 'image-webpack-loader',
            description: 'Устанавливаем зависимости для опции imageOptimization',
          });
        }
      };
    },
    deps: {
      configManager: CLIENT_CONFIG_MANAGER_TOKEN,
      cliRootDir: CLI_ROOT_DIR_TOKEN,
      packageManager: CLI_PACKAGE_MANAGER,
    },
  },
  {
    provide: WEBPACK_CLIENT_COMPILER_TOKEN,
    useFactory: ({ webpackConfig }: { webpackConfig: typeof WEBPACK_CLIENT_CONFIG_TOKEN }) => {
      return webpack(toWebpackConfig(webpackConfig));
    },
    deps: {
      webpackConfig: WEBPACK_CLIENT_CONFIG_TOKEN,
    },
  },
  {
    provide: PROCESS_HANDLER_TOKEN,
    multi: true,
    useFactory: ({
      webpackCompiler,
    }: {
      webpackCompiler: typeof WEBPACK_CLIENT_COMPILER_TOKEN;
    }) => {
      return function webpackBuild() {
        return runWebpack(webpackCompiler);
      };
    },
    deps: {
      webpackCompiler: WEBPACK_CLIENT_COMPILER_TOKEN,
    },
  },
  {
    provide: CLOSE_HANDLER_TOKEN,
    multi: true,
    useFactory: ({
      webpackCompiler,
    }: {
      webpackCompiler: typeof WEBPACK_CLIENT_COMPILER_TOKEN;
    }) => {
      return function webpackClose() {
        return closeWebpack(webpackCompiler);
      };
    },
    deps: {
      webpackCompiler: WEBPACK_CLIENT_COMPILER_TOKEN,
    },
  },
] as const;
