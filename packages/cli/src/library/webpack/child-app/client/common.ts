import type Config from 'webpack-chain';

import { StatsWriterPlugin } from 'webpack-stats-plugin';
import type { ConfigManager } from '../../../../config/configManager';

import common from '../common';
import files from '../../blocks/filesClient';
import nodeClient from '../../blocks/nodeClient';
import postcssAssets from '../../blocks/postcssAssets';
import type { LazyLibraryOptions } from '../../plugins/LazyLibraryInitialization';
import { LazyLibraryInitialization } from '../../plugins/LazyLibraryInitialization';
import { DEFAULT_STATS_FIELDS, DEFAULT_STATS_OPTIONS } from '../../constants/stats';
import { extractCssPluginFactory } from '../../blocks/extractCssPlugin';
import type { ChildAppConfigEntry } from '../../../../typings/configEntry/child-app';

export default (configManager: ConfigManager<ChildAppConfigEntry>) => (config: Config) => {
  const { name, version } = configManager;
  config.name('client');

  config.batch(common(configManager));

  config.target(['web', 'es5']);

  config.output
    .path(configManager.buildPath)
    .publicPath('auto')
    .library(configManager.name)
    .filename(`[name]_client@${version}.js`)
    .chunkFilename('[name]_client.chunk.[hash].js');

  config.batch(
    extractCssPluginFactory(configManager, {
      filename: `[name]@${version}.css`,
      chunkFilename: '[name].chunk.[hash].css',
    })
  );

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
