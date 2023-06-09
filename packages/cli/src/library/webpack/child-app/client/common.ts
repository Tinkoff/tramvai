import type Config from 'webpack-chain';
import { ChunkCorrelationPlugin } from '@module-federation/node';

import type { ConfigManager } from '../../../../config/configManager';

import common from '../common';
import files from '../../blocks/filesClient';
import nodeClient from '../../blocks/nodeClient';
import postcssAssets from '../../blocks/postcssAssets';
import type { ChildAppConfigEntry } from '../../../../typings/configEntry/child-app';
import type { ModuleFederationFixRangeOptions } from '../../plugins/ModuleFederationFixRange';
import { ModuleFederationFixRange } from '../../plugins/ModuleFederationFixRange';

export default (configManager: ConfigManager<ChildAppConfigEntry>) => (config: Config) => {
  const { name, version, shared } = configManager;
  config.name('client');

  config.batch(common(configManager));

  config.target(['web', 'es5']);

  config.output
    .path(configManager.buildPath)
    .publicPath('auto')
    .library(configManager.name)
    .filename(`[name]_client@${version}.js`)
    .chunkFilename('[name]_client.chunk.[contenthash].js');

  config.batch(postcssAssets(configManager));

  config.plugin('stats-plugin').use(ChunkCorrelationPlugin, [
    {
      filename: `${name}_stats@${version}.json`,
    },
  ]);

  config.plugin('module-federation-validate-duplicates').use(ModuleFederationFixRange, [
    {
      flexibleTramvaiVersions: shared.flexibleTramvaiVersions,
    } as ModuleFederationFixRangeOptions,
  ]);

  config.batch(files(configManager)).batch(nodeClient(configManager));
};
