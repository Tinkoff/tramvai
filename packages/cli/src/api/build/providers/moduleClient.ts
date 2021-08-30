import type { Provider } from '@tinkoff/dippy';
import rimraf from 'rimraf';
import webpack from 'webpack';
import {
  CLIENT_CONFIG_MANAGER_TOKEN,
  WEBPACK_CLIENT_CONFIG_TOKEN,
  INIT_HANDLER_TOKEN,
  WEBPACK_CLIENT_COMPILER_TOKEN,
} from '../tokens';
import { CONFIG_MANAGER_TOKEN, CLI_ROOT_DIR_TOKEN, CLI_PACKAGE_MANAGER } from '../../../di/tokens';
import { webpackClientConfig } from '../../../library/webpack/module/client/prod';
import { toWebpackConfig } from '../../../library/webpack/utils/toWebpackConfig';
import { npmRequire } from '../../../utils/npmRequire';

export const clientProviders: readonly Provider[] = [
  {
    provide: CLIENT_CONFIG_MANAGER_TOKEN,
    useFactory: ({ configManager }: { configManager: typeof CONFIG_MANAGER_TOKEN }) => {
      return configManager.withSettings({
        buildType: 'client',
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
      rootDir,
      packageManager,
    }: {
      configManager: typeof CLIENT_CONFIG_MANAGER_TOKEN;
      rootDir: typeof CLI_ROOT_DIR_TOKEN;
      packageManager: typeof CLI_PACKAGE_MANAGER;
    }) => {
      return async function prepareImageOptimization() {
        if (configManager.build?.configurations?.imageOptimization?.enabled) {
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
] as const;
