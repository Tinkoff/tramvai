import type { Configuration } from 'webpack';
import type Config from 'webpack-chain';
import type { CliConfigEntry, ConfigManager } from '@tramvai/cli';
import { filesClientWebpackRulesFactory } from '@tramvai/cli';
import { removeRules } from './removeRules';

export function addFilesRules({
  baseConfig,
  webpackConfig,
  configManager,
}: {
  baseConfig: Configuration;
  webpackConfig: Config;
  configManager: ConfigManager<CliConfigEntry>;
}) {
  // remove existed files loaders
  removeRules({ baseConfig, extensions: /(woff|svg|png|jpe?g|gif|webp|mp4|webm|avif)/ });

  filesClientWebpackRulesFactory(configManager)(webpackConfig);
}
