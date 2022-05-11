import type { Configuration } from 'webpack';
import type Config from 'webpack-chain';
import type { ConfigManager } from '@tramvai/cli';
import {
  extractCssPluginFactory,
  cssWebpackRulesFactory,
  lessWebpackRulesFactory,
  postcssAssetsWebpackRulesFactory,
} from '@tramvai/cli';
import { removeRules } from './removeRules';

export function addStylesRules({
  baseConfig,
  webpackConfig,
  configManager,
}: {
  baseConfig: Configuration;
  webpackConfig: Config;
  configManager: ConfigManager;
}) {
  // remove existed styles loaders
  removeRules({ baseConfig, extensions: /(css|less)/ });

  extractCssPluginFactory(configManager)(webpackConfig);
  cssWebpackRulesFactory(configManager)(webpackConfig);
  lessWebpackRulesFactory(configManager)(webpackConfig);
  postcssAssetsWebpackRulesFactory(configManager)(webpackConfig);
}
