import webpack from 'webpack';
import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../config/configManager';

export default (configManager: ConfigManager) => (config: Config) => {
  const sourceMapPluginOptions: Record<string, any> = {
    test: /\.js$/,
    filename: '[file].map',
  };

  if (configManager.debug) {
    config.module
      .rule('source-map-loader')
      .test(/\.js$/)
      .enforce('pre')
      .use('source-map')
      .loader('source-map-loader');
  } else {
    // отключаем указание пути до source map в production сборке
    sourceMapPluginOptions.append = false;
  }

  config.devtool(false);
  config.plugin('source-map').use(webpack.SourceMapDevToolPlugin, [sourceMapPluginOptions]);
};
