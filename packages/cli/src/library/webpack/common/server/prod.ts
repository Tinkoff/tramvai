import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../../config/configManager';
import type { CliConfigEntry } from '../../../../typings/configEntry/cli';
import { dedupe } from '../../blocks/dedupe';

export default (configManager: ConfigManager<CliConfigEntry>) => (config: Config) => {
  config.mode('production');

  config.plugin('define').tap((args) => [
    {
      ...args[0],
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  ]);

  if (configManager.dedupe.enabled) {
    config.batch(dedupe(configManager));
  }
};
