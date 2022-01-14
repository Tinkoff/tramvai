import type Config from 'webpack-chain';
import babelConfig from '../../babel';
import { createWorkerPoolBabel } from '../utils/workersPool';
import type { ConfigManager } from '../../../config/configManager';
import { getSwcOptions } from '../../swc';

export default (configManager: ConfigManager) => (config: Config) => {
  const {
    generateDataQaTag,
    alias,
    removeTypeofWindow,
    enableFillActionNamePlugin,
  } = configManager.build.configurations;
  const { loader } = configManager.experiments.transpilation;
  const { env, modern } = configManager;
  const loaderConfig = {
    isServer: configManager.buildType === 'server',
    env,
    generateDataQaTag,
    typescript: true,
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

  const cfg = config.module
    .rule('ts:project')
    .test(/\.ts[x]?$/)
    .exclude.add(/node_modules/)
    .end()
    .oneOf('default')
    // TODO разобраться почему на винде все плохо с thread-loader
    .when(process.platform !== 'win32', (cfg) =>
      cfg.use('thread').loader('thread-loader').options(createWorkerPoolBabel(configManager)).end()
    )
    .use('babel');

  if (loader === 'swc') {
    return cfg.loader('swc-loader').options(getSwcOptions(loaderConfig)).end();
  }

  if (loader === 'babel') {
    return cfg.loader('babel-loader').options(babelConfig(loaderConfig)).end();
  }
};
