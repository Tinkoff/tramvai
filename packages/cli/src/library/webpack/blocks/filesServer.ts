import path from 'path';
import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../config/configManager';
import { addSvgrLoader, getSvgoOptions } from '../utils/files';

export default (configManager: ConfigManager) => (config: Config) => {
  const svgoOptions = getSvgoOptions(configManager);

  config.module
    .rule('woff')
    .test(/\.woff2?$/)
    .set('type', 'asset')
    .set('generator', {
      emit: false,
    });

  addSvgrLoader(configManager, config, svgoOptions);

  config.module
    .rule('svg')
    .test(/\.svg$/)
    .set('resourceQuery', { not: /react/ })
    .set('type', 'asset/source')
    .use('svg')
    .loader('svgo-loader')
    .options(svgoOptions);

  config.module
    .rule('tramvai-image')
    .test(/\.(png|jpe?g|gif|webp)$/)
    .use('file')
    .loader(path.resolve(__dirname, '../loaders/image-loader'))
    .options({
      emitFile: false,
    })
    .end();

  config.module
    .rule('video')
    .test(/\.(mp4|webm|avif)$/)
    .set('type', 'asset/resource')
    .set('generator', {
      emit: false,
    });

  if (configManager.build?.configurations?.imageOptimization?.enabled) {
    config.module
      .rule('image-optimization')
      .test(/\.(gif|png|jpe?g|svg)$/)
      .use('image')
      .loader('image-webpack-loader')
      .options({ ...configManager.build?.configurations?.imageOptimization?.options })
      .end()
      .enforce('pre');
  }
};
