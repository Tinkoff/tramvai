import type Config from 'webpack-chain';
import { modernLibsFilter } from '@tinkoff/is-modern-lib';
import babelConfig from '../../babel';
import { getSwcOptions } from '../../swc';
import { createWorkerPoolBabel } from '../utils/workersPool';
import type { ConfigManager } from '../../../config/configManager';

// eslint-disable-next-line import/no-default-export
export default (configManager: ConfigManager) => (config: Config) => {
  const {
    generateDataQaTag,
    alias,
    removeTypeofWindow,
    enableFillActionNamePlugin,
    transpileOnlyModernLibs,
  } = configManager.build.configurations;
  const { env, modern } = configManager;
  const commonBabelConfig = {
    isServer: configManager.buildType === 'server',
    env,
    generateDataQaTag,
    modern,
    alias,
    tramvai: true,
    hot: configManager.hotRefresh,
    excludesPresetEnv: configManager.build.configurations.excludesPresetEnv,
    removeTypeofWindow,
    enableFillActionNamePlugin,
    rootDir: configManager.rootDir,
    target: configManager.target,
  };

  const jsRule = (babelCfg: Parameters<typeof babelConfig>[0]) => (rule: Config.Rule) => {
    const { loader } = configManager.experiments.transpilation;

    const cfg = rule
      .test(/\.[cm]?js[x]?$/)
      .oneOf('default')
      // TODO разобраться почему на винде все плохо с thread-loader
      .when(process.platform !== 'win32' && !configManager.debug, (cfg) =>
        cfg
          .use('thread')
          .loader('thread-loader')
          .options(createWorkerPoolBabel(configManager))
          .end()
      )
      .use('babel');

    if (loader === 'swc') {
      return cfg.loader('swc-loader').options(getSwcOptions(babelCfg)).end();
    }

    if (loader === 'babel') {
      return cfg.loader('babel-loader').options(babelConfig(babelCfg)).end();
    }
  };

  if (transpileOnlyModernLibs) {
    config.module
      .rule('js:project')
      .exclude.add(/node_modules/)
      .end()
      .batch(jsRule(commonBabelConfig));

    config.module
      .rule('js:node_modules')
      .include.add(modernLibsFilter)
      .end()
      .batch(jsRule({ ...commonBabelConfig, hot: false }))
      .merge({
        // TODO: некоторые пакеты неправильно описывают импорты для es модулей
        // https://github.com/babel/babel/issues/12058
        resolve: { fullySpecified: false },
      });
  } else {
    config.module
      .rule('js:project')
      .exclude.add(/node_modules/)
      .end()
      .batch(jsRule(commonBabelConfig));

    config.module
      .rule('js:node_modules')
      .include.add(/node_modules/)
      .end()
      .batch(jsRule({ ...commonBabelConfig, hot: false }))
      .merge({
        // TODO: некоторые пакеты неправильно описывают импорты для es модулей
        // https://github.com/babel/babel/issues/12058
        resolve: { fullySpecified: false },
      });
  }
};
