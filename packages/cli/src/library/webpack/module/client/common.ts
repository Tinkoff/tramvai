import type Config from 'webpack-chain';

import { StatsWriterPlugin } from 'webpack-stats-plugin';
import type { ConfigManager } from '../../../../config/configManager';
import type { ModuleConfigEntry } from '../../../../typings/configEntry/module';

import common from '../common';
import files from '../../blocks/filesClient';
import nodeClient from '../../blocks/nodeClient';
import postcssAssets from '../../blocks/postcssAssets';
import LazyModuleInitializationPlugin from '../../plugins/LazyModuleInitialization';
import { DEFAULT_STATS_FIELDS, DEFAULT_STATS_OPTIONS } from '../../constants/stats';
import { extractCssPluginFactory } from '../../blocks/extractCssPlugin';

export default (configManager: ConfigManager<ModuleConfigEntry>) => (config: Config) => {
  config.name('client');

  config.batch(common(configManager));

  config.target(['web', 'es5']);

  config.output
    .path(configManager.buildPath)
    .publicPath('')
    .library(configManager.name)
    .libraryTarget('lazy')
    .filename('[name]_client.js')
    .chunkFilename('[name]_client.chunk.js');

  config.batch(extractCssPluginFactory(configManager));

  config.batch(postcssAssets(configManager));

  config.plugin('lazy-module').use(LazyModuleInitializationPlugin, [
    {
      name: configManager.name,
    },
  ]);

  config.plugin('define').tap((args) => [
    {
      ...args[0],
      'process.env.BROWSER': true,
      'process.env.SERVER': false,
    },
  ]);

  config.plugin('stats-plugin').use(StatsWriterPlugin, [
    {
      filename: 'stats.json',
      stats: DEFAULT_STATS_OPTIONS,
      fields: DEFAULT_STATS_FIELDS,
    },
  ]);

  config.batch(files(configManager)).batch(nodeClient(configManager));
};
