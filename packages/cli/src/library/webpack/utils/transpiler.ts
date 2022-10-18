import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../config/configManager';
import { getSwcOptions } from '../../swc';
import babelConfig from '../../babel';

export const addTranspilerLoader = (
  configManager: ConfigManager,
  rule: Config.Use,
  transpilerConfig: Record<string, any>
) => {
  const { loader } = configManager.experiments.transpilation;

  if (loader === 'swc') {
    return rule.loader('swc-loader').options(getSwcOptions(transpilerConfig)).end();
  }

  if (loader === 'babel') {
    return rule.loader('babel-loader').options(babelConfig(transpilerConfig)).end();
  }
};

export const getTranspilerConfig = (configManager: ConfigManager) => {
  const { generateDataQaTag, alias, removeTypeofWindow, enableFillActionNamePlugin } =
    configManager.build.configurations;
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
    excludesPresetEnv: configManager.build.configurations.excludesPresetEnv,
    enableFillActionNamePlugin,
    rootDir: configManager.rootDir,
    target: configManager.target,
  };
};
