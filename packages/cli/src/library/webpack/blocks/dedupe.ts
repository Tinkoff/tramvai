import type Config from 'webpack-chain';
import { DedupePlugin } from '@tinkoff/webpack-dedupe-plugin';
import type { DedupePluginOptions } from '@tinkoff/webpack-dedupe-plugin';
import type { CliConfigEntry, ConfigManager } from '../../../api';

export const dedupe =
  (configManager: ConfigManager<CliConfigEntry>, options?: Partial<DedupePluginOptions>) =>
  (config: Config) => {
    config.plugin('dedupe-plugin').use(DedupePlugin, [
      {
        strategy: configManager.dedupe.strategy,
        ignorePackages: configManager.dedupe.ignore?.map((ignore) => new RegExp(`^${ignore}`)),
        showLogs: false,
        ...options,
      } as DedupePluginOptions,
    ]);
  };
