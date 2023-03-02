import type Config from 'webpack-chain';
import type { DedupePluginOptions } from '@tinkoff/webpack-dedupe-plugin';
import { DedupePlugin } from '@tinkoff/webpack-dedupe-plugin';
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
    config.plugin('dedupe-plugin').use(DedupePlugin, [
      {
        strategy: configManager.dedupe.strategy,
        showLogs: false,
        ignorePackages: configManager.dedupe.ignore?.map((ignore) => new RegExp(`^${ignore}`)),
      } as DedupePluginOptions,
    ]);
  }
};
