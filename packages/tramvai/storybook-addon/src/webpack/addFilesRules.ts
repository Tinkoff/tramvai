import type { Configuration } from 'webpack';
import type Config from 'webpack-chain';
import type { ConfigManager } from '@tramvai/cli';
import { filesClientWebackRulesFactory } from '@tramvai/cli';
import { removeRules } from './removeRules';

export function addFilesRules({
  baseConfig,
  webpackConfig,
  configManager,
}: {
  baseConfig: Configuration;
  webpackConfig: Config;
  configManager: ConfigManager;
}) {
  // remove existed files loaders
  removeRules({ baseConfig, extensions: /(woff|svg|png|jpe?g|gif|webp|mp4|webm|avif)/ });

  filesClientWebackRulesFactory(configManager)(webpackConfig);
}
