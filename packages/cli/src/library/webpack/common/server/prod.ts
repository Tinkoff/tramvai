import type Config from 'webpack-chain';
import { createDedupePlugin } from '@tinkoff/webpack-dedupe-plugin';
import type { ConfigManager } from '../../../../config/configManager';

export default (configManager: ConfigManager) => (config: Config) => {
  config.mode('production');

  config.plugin('define').tap((args) => [
    {
      ...args[0],
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  ]);

  if (configManager.dedupe) {
    config
      .plugin('dedupe-plugin')
      .use(createDedupePlugin(configManager.dedupe, configManager.dedupeIgnore));
  }
};
