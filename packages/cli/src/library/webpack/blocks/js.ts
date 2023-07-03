import type Config from 'webpack-chain';
import { modernLibsFilter } from '@tinkoff/is-modern-lib';
import { createWorkerPoolTranspiler } from '../utils/workersPool';
import type { ConfigManager } from '../../../config/configManager';
import { getTranspilerConfig, addTranspilerLoader } from '../utils/transpiler';
import type { CliConfigEntry } from '../../../typings/configEntry/cli';

// eslint-disable-next-line import/no-default-export
export default (configManager: ConfigManager<CliConfigEntry>) => (config: Config) => {
  const { transpileOnlyModernLibs } = configManager;

  const rule = config.module
    .rule('js')
    .test(/\.[cm]?js[x]?$/)
    // TODO: разобраться почему на винде все плохо с thread-loader
    .when(process.platform !== 'win32' && !configManager.debug, (cfg) =>
      cfg
        .use('thread')
        .loader('thread-loader')
        .options(createWorkerPoolTranspiler(configManager))
        .end()
    );

  rule
    .oneOf('project')
    .exclude.add(/node_modules/)
    .end()
    .use('transpiler')
    .batch(addTranspilerLoader(configManager, getTranspilerConfig(configManager)));

  rule
    .oneOf('node_module')
    .when(transpileOnlyModernLibs, (cfg) => cfg.include.add(modernLibsFilter))
    .merge({
      // true value forces to use file extensions for importing mjs modules
      // but we want to use mjs if it exists anyway
      resolve: { fullySpecified: false },
    })
    .use('transpiler')
    .batch(addTranspilerLoader(configManager, getTranspilerConfig(configManager, { hot: false })));
};
