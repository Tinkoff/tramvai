import type Config from 'webpack-chain';
import { sync as resolve } from 'resolve';
import type { ConfigManager } from '../../../config/configManager';
import { getSwcOptions } from '../../swc';
import babelConfig from '../../babel';
import type { Env } from '../../../typings/Env';
import type { Target } from '../../../typings/target';

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
  alias: Record<string, any>;
  tramvai: boolean;
  hot: boolean;
  excludesPresetEnv: string[];
  rootDir: string;
};

export const addTranspilerLoader = (
  configManager: ConfigManager,
  rule: Config.Use,
  transpilerConfig: TranspilerConfig
) => {
  const { loader } = configManager.experiments.transpilation;

  if (loader === 'swc') {
    try {
      resolve('@tramvai/swc-integration/package.json', { basedir: configManager.rootDir });
    } catch (error) {
      throw new Error(`You are using swc loader for the transpilation, but required module is not installed.
Please run "tramvai add --dev @tramvai/swc-integration" to fix the problem
      `);
    }

    return rule.loader('swc-loader').options(getSwcOptions(transpilerConfig)).end();
  }

  if (loader === 'babel') {
    return rule.loader('babel-loader').options(babelConfig(transpilerConfig)).end();
  }
};

export const getTranspilerConfig = (
  configManager: ConfigManager,
  overrideOptions: Partial<TranspilerConfig> = {}
): TranspilerConfig => {
  const {
    generateDataQaTag,
    alias,
    removeTypeofWindow,
    enableFillActionNamePlugin,
    excludesPresetEnv,
  } = configManager.build.configurations;
  const { env, modern } = configManager;

  return {
    isServer: configManager.buildType === 'server',
    env,
    generateDataQaTag,
    modern,
    alias,
    tramvai: true,
    removeTypeofWindow,
    hot: configManager.hotRefresh,
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
