import path from 'path';
import type Config from 'webpack-chain';
import PostcssAssetsPlugin from 'postcss-assets-webpack-plugin';
import type { ConfigManager } from '../../../config/configManager';

import safeRequire from '../../../utils/safeRequire';

export default (configManager: ConfigManager) => (config: Config) => {
  const {
    postcss: { assetsConfig: postcssAssetsConfigPath = '' } = {},
  } = configManager.build.configurations;

  const postcssAssetsConfig = postcssAssetsConfigPath
    ? safeRequire(path.resolve(configManager.rootDir, postcssAssetsConfigPath), true)
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
