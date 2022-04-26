import path from 'path';
import type Config from 'webpack-chain';
import PostcssAssetsPlugin from 'postcss-assets-webpack-plugin';
import type { ConfigManager } from '../../../config/configManager';

import { safeRequire } from '../../../utils/safeRequire';

export const postcssAssetsWebpackRulesFactory = (configManager: ConfigManager) => (
  config: Config
) => {
  const {
    postcss: { assetsConfig: postcssAssetsConfigPath = '' } = {},
  } = configManager.build.configurations;

  const postcssAssetsConfig = postcssAssetsConfigPath
    ? safeRequire(
        path.resolve(configManager.rootDir, postcssAssetsConfigPath),
        process.env.NODE_ENV === 'test'
      ) ?? {
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
