import type Config from 'webpack-chain';

import type { ConfigManager } from '../../../../config/configManager';

import common from '../common';
import files from '../../blocks/filesServer';
import RuntimePathPlugin from '../../plugins/RuntimePathPlugin';
import { extractCssPluginFactory } from '../../blocks/extractCssPlugin';
import type { ChildAppConfigEntry } from '../../../../typings/configEntry/child-app';

export default (configManager: ConfigManager<ChildAppConfigEntry>) => (config: Config) => {
  config.name('server');

  config.batch(common(configManager));

  config.target('node');

  config.output
    .path(configManager.buildPath)
    .publicPath('')
    .filename(`[name]_server@${configManager.version}.js`)
    .chunkFilename('[name]_server.chunk.[hash].js');

  config.batch(
    extractCssPluginFactory(configManager, {
      // we don't need the css on server, but it's needed to generate proper classnames in js
      filename: `[name]_server@${configManager.version}.css`,
      chunkFilename: null,
    })
  );

  config.plugin('runtime-path').use(RuntimePathPlugin, [
    {
      publicPath: 'ASSETS_PREFIX',
    },
  ]);

  config.batch(files(configManager));
};
