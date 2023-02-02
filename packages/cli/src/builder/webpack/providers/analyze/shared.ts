import type { Provider } from '@tinkoff/dippy';
import { provide } from '@tinkoff/dippy';
import chalk from 'chalk';
import rimraf from 'rimraf';
import webpack from 'webpack';
import type { ConfigManager } from '../../../../api';
import {
  CLI_PACKAGE_MANAGER,
  CLI_ROOT_DIR_TOKEN,
  CONFIG_MANAGER_TOKEN,
} from '../../../../di/tokens';
import { toWebpackConfig } from '../../../../library/webpack/utils/toWebpackConfig';
import { npmRequire, npmRequireList } from '../../../../utils/npmRequire';
import { BundleAnalyzePlugin } from '../../analyzePlugins/bundle';
import { StatoscopeAnalyzePlugin } from '../../analyzePlugins/statoscope';
import { WhyBundledAnalyzePlugin } from '../../analyzePlugins/whyBundled';
import {
  CLIENT_CONFIG_MANAGER_TOKEN,
  INIT_HANDLER_TOKEN,
  CLOSE_HANDLER_TOKEN,
  PROCESS_HANDLER_TOKEN,
  WEBPACK_ANALYZE_PLUGIN_NAME_TOKEN,
  WEBPACK_ANALYZE_PLUGIN_TOKEN,
  WEBPACK_CLIENT_COMPILER_TOKEN,
  WEBPACK_CLIENT_CONFIG_TOKEN,
} from '../../tokens';
import type { AnalyzePlugin } from '../../types';
import { runWebpack } from '../../utils/runWebpack';

interface Type<T> extends Function {
  new (...args: any[]): T;
}

const pluginMap: Record<string, Type<AnalyzePlugin>> = {
  bundle: BundleAnalyzePlugin,
  whybundled: WhyBundledAnalyzePlugin,
  statoscope: StatoscopeAnalyzePlugin,
};

export const analyzeSharedProviders: Provider[] = [
  provide({
    provide: WEBPACK_ANALYZE_PLUGIN_TOKEN,
    useFactory: ({ pluginName }) => {
      const PluginClass = pluginMap[pluginName];

      if (!PluginClass) {
        throw new Error('Set correct plugin option');
      }

      return new PluginClass();
    },
    deps: {
      pluginName: WEBPACK_ANALYZE_PLUGIN_NAME_TOKEN,
    },
  }),
  provide({
    provide: CLIENT_CONFIG_MANAGER_TOKEN,
    useFactory: ({ configManager }) => {
      return configManager.withSettings({
        buildType: 'client',
      });
    },
    deps: {
      configManager: CONFIG_MANAGER_TOKEN,
    },
  }),
  provide({
    provide: WEBPACK_CLIENT_COMPILER_TOKEN,
    useFactory: ({ webpackConfig, analyzePlugin }) => {
      return webpack(toWebpackConfig(analyzePlugin.patchConfig(webpackConfig)));
    },
    deps: {
      webpackConfig: WEBPACK_CLIENT_CONFIG_TOKEN,
      analyzePlugin: WEBPACK_ANALYZE_PLUGIN_TOKEN,
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
    provide: INIT_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ analyzePlugin, rootDir, packageManager }) => {
      const { requireDeps } = analyzePlugin;

      return async () => {
        if (requireDeps) {
          await npmRequireList({
            cliRootDir: rootDir,
            packageManager,
            dependencies: requireDeps,
            description: 'Install dependencies for the analyze command',
          });
        }
      };
    },
    deps: {
      analyzePlugin: WEBPACK_ANALYZE_PLUGIN_TOKEN,
      rootDir: CLI_ROOT_DIR_TOKEN,
      packageManager: CLI_PACKAGE_MANAGER,
    },
  }),
  provide({
    provide: PROCESS_HANDLER_TOKEN,
    multi: true,
    useFactory: ({ webpackCompiler }) => {
      return function webpackBuild() {
        console.log(chalk.green('Starting build with analyze tool'));
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
    useFactory: ({ analyzePlugin }) => {
      return () => {
        return analyzePlugin.afterBuild();
      };
    },
    deps: {
      analyzePlugin: WEBPACK_ANALYZE_PLUGIN_TOKEN,
    },
  }),
];
