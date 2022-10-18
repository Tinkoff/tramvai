import type Config from 'webpack-chain';
import { modernLibsFilter } from '@tinkoff/is-modern-lib';
import type babelConfig from '../../babel';
import { createWorkerPoolBabel } from '../utils/workersPool';
import type { ConfigManager } from '../../../config/configManager';
import { getTranspilerConfig, addTranspilerLoader } from '../utils/transpiler';

// eslint-disable-next-line import/no-default-export
export default (configManager: ConfigManager) => (config: Config) => {
  const transpilerConfig = getTranspilerConfig(configManager);
  const { transpileOnlyModernLibs } = configManager.build.configurations;

  const jsRule = (babelCfg: Parameters<typeof babelConfig>[0]) => (rule: Config.Rule) => {
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

    return addTranspilerLoader(configManager, cfg, babelCfg);
  };

  if (transpileOnlyModernLibs) {
    config.module
      .rule('js:project')
      .exclude.add(/node_modules/)
      .end()
      .batch(jsRule(transpilerConfig));

    config.module
      .rule('js:node_modules')
      .include.add(modernLibsFilter)
      .end()
      .batch(jsRule({ ...transpilerConfig, hot: false }))
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
      .batch(jsRule(transpilerConfig));

    config.module
      .rule('js:node_modules')
      .include.add(/node_modules/)
      .end()
      .batch(jsRule({ ...transpilerConfig, hot: false }))
      .merge({
        // TODO: некоторые пакеты неправильно описывают импорты для es модулей
        // https://github.com/babel/babel/issues/12058
        resolve: { fullySpecified: false },
      });
  }
};
