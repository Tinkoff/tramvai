import type Config from 'webpack-chain';

import type { ConfigManager } from '../../../../config/configManager';
import type { ModuleConfigEntry } from '../../../../typings/configEntry/module';

import common from '../common';
import files from '../../blocks/filesServer';
import { extractCssPluginFactory } from '../../blocks/extractCssPlugin';

export default (configManager: ConfigManager<ModuleConfigEntry>) => (config: Config) => {
  config.name('server');

  config.batch(common(configManager));

  config.target('node');

  config.output
    .path(configManager.getBuildPath())
    .publicPath('')
    .filename('[name]_server.js')
    .chunkFilename('[name]_server.chunk.js')
    .libraryTarget('commonjs2');

  config.batch(
    extractCssPluginFactory(configManager, {
      // we don't need the css on server, but it's needed to generate proper classnames in js
      filename: '[name]_server.css',
      chunkFilename: null,
    })
  );

  config.plugin('define').tap((args) => [
    {
      ...args[0],
      'process.env.BROWSER': false,
      'process.env.SERVER': true,
      'global.GENTLY': false,
    },
  ]);

  config.batch(files(configManager));
};
