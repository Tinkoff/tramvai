import type Config from 'webpack-chain';
import ExtractCssPlugin from 'mini-css-extract-plugin';

import type { ConfigManager } from '../../../../config/configManager';
import type { ModuleConfigEntry } from '../../../../typings/configEntry/module';

import common from '../common';
import files from '../../blocks/filesClient';
import nodeClient from '../../blocks/nodeClient';
import postcssAssets from '../../blocks/postcssAssets';
import LazyModuleInitializationPlugin from '../../plugins/LazyModuleInitialization';

export default (configManager: ConfigManager<ModuleConfigEntry>) => (config: Config) => {
  config.name('client');

  config.batch(common(configManager));

  config.target(['web', 'es5']);

  config.output
    .path(configManager.getBuildPath())
    .publicPath('')
    .library(configManager.name)
    .libraryTarget('lazy')
    .filename('[name]_client.js')
    .chunkFilename('[name]_client.chunk.js');

  config.plugin('extract-css').use(ExtractCssPlugin, [
    {
      filename: '[name].css',
      chunkFilename: '[name].chunk.css',
      ignoreOrder: true,
      experimentalUseImportModule: !!configManager.experiments.minicss?.useImportModule,
    },
  ]);

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

  config.batch(files(configManager)).batch(nodeClient(configManager));
};
