import type Config from 'webpack-chain';
import { sync as resolve } from 'resolve';
import type { ConfigManager } from '../../../config/configManager';
import { getSwcOptions } from '../../swc';
import { babelConfigFactory } from '../../babel';
import type { Env } from '../../../typings/Env';
import type { Target } from '../../../typings/target';
import type { CliConfigEntry } from '../../../typings/configEntry/cli';

export type TranspilerConfig = {
  env: Env;
  target: Target;
  modern: boolean;
  isServer: boolean;
  generateDataQaTag: boolean;
  enableFillActionNamePlugin: boolean;
  typescript: boolean;
  modules: 'es6' | 'commonjs' | false;
  loader: boolean;
  removeTypeofWindow: boolean;
  tramvai: boolean;
  hot: boolean;
  excludesPresetEnv: string[];
  rootDir: string;
};

export const addTranspilerLoader =
  (configManager: ConfigManager<CliConfigEntry>, transpilerConfig: TranspilerConfig) =>
  (rule: Config.Use) => {
    const { loader } = configManager.experiments.transpilation;

    if (loader === 'swc') {
      try {
        resolve('@tramvai/swc-integration/package.json', { basedir: configManager.rootDir });
      } catch (error) {
        throw new Error(`You are using swc loader for the transpilation, but required module is not installed.
Please run "npx tramvai add --dev @tramvai/swc-integration" to fix the problem
      `);
      }

      return rule.loader('swc-loader').options(getSwcOptions(transpilerConfig)).end();
    }

    if (loader === 'babel') {
      return rule.loader('babel-loader').options(babelConfigFactory(transpilerConfig)).end();
    }
  };

export const getTranspilerConfig = (
  configManager: ConfigManager<CliConfigEntry>,
  overrideOptions: Partial<TranspilerConfig> = {}
): TranspilerConfig => {
  const { generateDataQaTag, alias, enableFillActionNamePlugin, excludesPresetEnv } = configManager;
  const { env, modern } = configManager;

  if (alias) {
    console.warn(`"alias" option deprecated and ignored as cli now supports baseUrl and paths from the app's tsconfig.json file.
Just check or add configuration to your tsconfig file and remove alias from tramvai.json`);
  }

  return {
    isServer: configManager.buildType === 'server',
    env,
    generateDataQaTag,
    modern,
    tramvai: true,
    removeTypeofWindow: true,
    hot: !!configManager.hotRefresh.enabled,
    excludesPresetEnv,
    enableFillActionNamePlugin,
    rootDir: configManager.rootDir,
    target: configManager.target,
    loader: true,
    modules: false,
    typescript: false,
    ...overrideOptions,
  };
};
