import path from 'path';
import type Config from 'webpack-chain';

import type { ConfigManager } from '../../../../config/configManager';

import common from '../common';
import files from '../../blocks/filesServer';
import RuntimePathPlugin from '../../plugins/RuntimePathPlugin';
import type { ChildAppConfigEntry } from '../../../../typings/configEntry/child-app';

export default (configManager: ConfigManager<ChildAppConfigEntry>) => (config: Config) => {
  config.name('server');

  // settings false is required by the UniversalModuleFederationPlugin
  // https://github.com/module-federation/universe/blob/02221527aa684d2a37773c913bf341748fd34ecf/packages/node/src/plugins/StreamingTargetPlugin.ts#L24
  config.target(false);

  config.batch(common(configManager));

  config.output
    .path(configManager.buildPath)
    .publicPath('')
    .filename(`[name]_server@${configManager.version}.js`)
    .chunkFilename('[name]_server.chunk.[contenthash].js');

  config.plugin('runtime-path').use(RuntimePathPlugin, [
    {
      publicPath: 'ASSETS_PREFIX',
    },
  ]);

  config.batch(files(configManager));

  config.module
    .rule('child-app-fallback')
    .set('resourceQuery', /fallback/)
    .use('fallback')
    .loader(path.resolve(__dirname, '../../loaders/childAppFallback'))
    .options({ name: configManager.name });
};
