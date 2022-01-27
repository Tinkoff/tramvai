import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import webpack from 'webpack';
import { CONFIG_MANAGER_TOKEN } from '../../../../di/tokens';
import { toWebpackConfig } from '../../../../library/webpack/utils/toWebpackConfig';
import {
  CLIENT_MODERN_CONFIG_MANAGER_TOKEN,
  CLOSE_HANDLER_TOKEN,
  PROCESS_HANDLER_TOKEN,
  WEBPACK_CLIENT_MODERN_COMPILER_TOKEN,
  WEBPACK_CLIENT_MODERN_CONFIG_TOKEN,
} from '../../tokens';
import { closeWebpack } from '../../utils/closeWebpack';
import { runWebpack } from '../../utils/runWebpack';

export const buildClientModernProviders: Provider[] = [
  provide({
    provide: CLIENT_MODERN_CONFIG_MANAGER_TOKEN,
    useFactory: ({ configManager }) => {
      return configManager.withSettings({
        buildType: 'client',
        modern: true,
      });
    },
    deps: {
      configManager: CONFIG_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: WEBPACK_CLIENT_MODERN_COMPILER_TOKEN,
    useFactory: ({ webpackConfig }) => {
      return webpack(toWebpackConfig(webpackConfig));
    },
    deps: {
      webpackConfig: WEBPACK_CLIENT_MODERN_CONFIG_TOKEN,
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
      webpackCompiler: WEBPACK_CLIENT_MODERN_COMPILER_TOKEN,
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
      webpackCompiler: WEBPACK_CLIENT_MODERN_COMPILER_TOKEN,
    },
  }),
];
