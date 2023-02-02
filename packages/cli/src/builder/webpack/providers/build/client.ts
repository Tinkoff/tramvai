import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import rimraf from 'rimraf';
import webpack from 'webpack';
import type { ConfigManager } from '../../../../config/configManager';
import {
  CLI_PACKAGE_MANAGER,
  CLI_ROOT_DIR_TOKEN,
  CONFIG_MANAGER_TOKEN,
} from '../../../../di/tokens';
import { toWebpackConfig } from '../../../../library/webpack/utils/toWebpackConfig';
import { npmRequire } from '../../../../utils/npmRequire';
import {
  CLIENT_CONFIG_MANAGER_TOKEN,
  CLOSE_HANDLER_TOKEN,
  INIT_HANDLER_TOKEN,
  PROCESS_HANDLER_TOKEN,
  WEBPACK_CLIENT_COMPILER_TOKEN,
  WEBPACK_CLIENT_CONFIG_TOKEN,
} from '../../tokens';
import { closeWebpack } from '../../utils/closeWebpack';
import { runWebpack } from '../../utils/runWebpack';

export const buildClientProviders: Provider[] = [
  provide({
    provide: CLIENT_CONFIG_MANAGER_TOKEN,
    useFactory: ({ configManager }) => {
      return configManager.withSettings({
        buildType: 'client',
        modern: false,
      });
    },
    deps: {
      configManager: CONFIG_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: WEBPACK_CLIENT_COMPILER_TOKEN,
    useFactory: ({ webpackConfig }) => {
      return webpack(toWebpackConfig(webpackConfig));
    },
    deps: {
      webpackConfig: WEBPACK_CLIENT_CONFIG_TOKEN,
    },
  }),
  provide({
    provide: INIT_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ configManager }) => {
      return function clearBuildDir() {
        return rimraf.sync(`${configManager.buildPath}/**`, {});
      };
    },
    deps: {
      configManager: CLIENT_CONFIG_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: INIT_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ configManager, rootDir, packageManager }) => {
      return async function prepareImageOptimization() {
        if (configManager.imageOptimization?.enabled) {
          await npmRequire({
            cliRootDir: rootDir,
            packageManager,
            packageName: 'image-webpack-loader',
            description: 'Устанавливаем зависимости для опции imageOptimization',
          });
        }
      };
    },
    deps: {
      configManager: CLIENT_CONFIG_MANAGER_TOKEN,
      rootDir: CLI_ROOT_DIR_TOKEN,
      packageManager: CLI_PACKAGE_MANAGER,
    },
  }),
  provide({
    provide: PROCESS_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ webpackCompiler }) => {
      return function webpackBuild() {
        return runWebpack(webpackCompiler);
      };
    },
    deps: {
      webpackCompiler: WEBPACK_CLIENT_COMPILER_TOKEN,
    },
  }),
  provide({
    provide: CLOSE_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ webpackCompiler }) => {
      return function webpackClose() {
        return closeWebpack(webpackCompiler);
      };
    },
    deps: {
      webpackCompiler: WEBPACK_CLIENT_COMPILER_TOKEN,
    },
  }),
];
