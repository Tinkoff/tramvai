import path from 'path';
import type Config from 'webpack-chain';
import PostcssAssetsPlugin from 'postcss-assets-webpack-plugin';
import type { ConfigManager } from '../../../config/configManager';

import { safeRequire } from '../../../utils/safeRequire';
import type { CliConfigEntry } from '../../../typings/configEntry/cli';

export const postcssAssetsWebpackRulesFactory =
  (configManager: ConfigManager<CliConfigEntry>) => (config: Config) => {
    const {
      postcss: { assetsConfig: postcssAssetsConfigPath = '' },
    } = configManager;

    const postcssAssetsConfig = postcssAssetsConfigPath
      ? safeRequire(path.resolve(configManager.rootDir, postcssAssetsConfigPath)) ?? {
          plugins: [],
        }
      : { plugins: [] };

    if (postcssAssetsConfig.plugins.length) {
      config.plugin('postcss-assets').use(PostcssAssetsPlugin, [
        {
          test: /\.css$/,
          log: false,
          plugins: postcssAssetsConfig.plugins,
        },
      ]);
    }
  };

export default postcssAssetsWebpackRulesFactory;
