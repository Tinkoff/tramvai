import type Config from 'webpack-chain';
import ExtractCssPlugin from 'mini-css-extract-plugin';

import { StatsWriterPlugin } from 'webpack-stats-plugin';
import type { ConfigManager } from '../../../../config/configManager';
import type { ModuleConfigEntry } from '../../../../typings/configEntry/module';

import common from '../common';
import files from '../../blocks/filesClient';
import nodeClient from '../../blocks/nodeClient';
import postcssAssets from '../../blocks/postcssAssets';
import type { LazyLibraryOptions } from '../../plugins/LazyLibraryInitialization';
import { LazyLibraryInitialization } from '../../plugins/LazyLibraryInitialization';
import { DEFAULT_STATS_FIELDS, DEFAULT_STATS_OPTIONS } from '../../constants/stats';

export default (configManager: ConfigManager<ModuleConfigEntry>) => (config: Config) => {
  const { name, version } = configManager;
  config.name('client');

  config.batch(common(configManager));

  config.target(['web', 'es5']);

  config.output
    .path(configManager.getBuildPath())
    .publicPath('auto')
    .library(configManager.name)
    .filename(`[name]_client@${version}.js`)
    .chunkFilename('[name]_client.chunk.[hash].js');

  config.plugin('extract-css').use(ExtractCssPlugin, [
    {
      filename: `[name]@${version}.css`,
      chunkFilename: '[name].chunk.[hash].css',
      ignoreOrder: true,
      experimentalUseImportModule: !!configManager.experiments.minicss?.useImportModule,
    },
  ]);

  config.batch(postcssAssets(configManager));

  config.plugin('lazy-initialization').use(LazyLibraryInitialization, [
    {
      prefix: 'child-app',
    } as LazyLibraryOptions,
  ]);

  config.plugin('stats-plugin').use(StatsWriterPlugin, [
    {
      filename: `${name}_stats@${version}.json`,
      stats: DEFAULT_STATS_OPTIONS,
      fields: DEFAULT_STATS_FIELDS,
    },
  ]);

  config.batch(files(configManager)).batch(nodeClient(configManager));
};
