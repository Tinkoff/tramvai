import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../config/configManager';

export default (configManager: ConfigManager) => (config: Config) => {
  if (configManager.debug || configManager.env === 'development') {
    config.module
      .rule('source-map-loader')
      .test(/\.js$/)
      .enforce('pre')
      .use('source-map')
      .loader('source-map-loader');

    config.devtool('source-map');
  } else {
    config.devtool('hidden-source-map');
  }
};
