import type Config from 'webpack-chain';
import { createDedupePlugin } from '@tinkoff/webpack-dedupe-plugin';
import type { ConfigManager } from '../../../../config/configManager';
import type { CliConfigEntry } from '../../../../typings/configEntry/cli';

export default (configManager: ConfigManager<CliConfigEntry>) => (config: Config) => {
  config.mode('production');

  config.plugin('define').tap((args) => [
    {
      ...args[0],
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  ]);

  if (configManager.dedupe.enabled) {
    config.plugin('dedupe-plugin').use(
      createDedupePlugin(
        configManager.dedupe.strategy,
        configManager.dedupe.ignore?.map((ignore) => new RegExp(`^${ignore}`))
      )
    );
  }
};
