import type Config from 'webpack-chain';
import { modernLibsFilter } from '@tinkoff/is-modern-lib';
import { createWorkerPoolTranspiler } from '../utils/workersPool';
import type { ConfigManager } from '../../../config/configManager';
import type { TranspilerConfig } from '../utils/transpiler';
import { getTranspilerConfig, addTranspilerLoader } from '../utils/transpiler';

// eslint-disable-next-line import/no-default-export
export default (configManager: ConfigManager) => (config: Config) => {
  const { transpileOnlyModernLibs } = configManager.build.configurations;

  const jsRule = (transpilerConfig: TranspilerConfig) => (rule: Config.Rule) => {
    const cfg = rule
      .test(/\.[cm]?js[x]?$/)
      .oneOf('default')
      // TODO разобраться почему на винде все плохо с thread-loader
      .when(process.platform !== 'win32' && !configManager.debug, (cfg) =>
        cfg
          .use('thread')
          .loader('thread-loader')
          .options(createWorkerPoolTranspiler(configManager))
          .end()
      )
      .use('transpiler');

    return addTranspilerLoader(configManager, cfg, transpilerConfig);
  };

  if (transpileOnlyModernLibs) {
    config.module
      .rule('js:project')
      .exclude.add(/node_modules/)
      .end()
      .batch(jsRule(getTranspilerConfig(configManager)));

    config.module
      .rule('js:node_modules')
      .include.add(modernLibsFilter)
      .end()
      .batch(jsRule(getTranspilerConfig(configManager, { hot: false })))
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
      .batch(jsRule(getTranspilerConfig(configManager)));

    config.module
      .rule('js:node_modules')
      .include.add(/node_modules/)
      .end()
      .batch(jsRule(getTranspilerConfig(configManager, { hot: false })))
      .merge({
        // TODO: некоторые пакеты неправильно описывают импорты для es модулей
        // https://github.com/babel/babel/issues/12058
        resolve: { fullySpecified: false },
      });
  }
};
