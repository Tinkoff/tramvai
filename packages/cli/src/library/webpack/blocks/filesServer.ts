import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../config/configManager';

export default (configManager: ConfigManager) => (config: Config) => {
  config.module
    .rule('woff')
    .test(/\.woff2?$/)
    .set('type', 'asset')
    .set('generator', {
      emit: false,
    });

  config.module
    .rule('svg')
    .test(/\.svg$/)
    .set('type', 'asset/source')
    .use('svg')
    .loader('svgo-loader')
    .options({
      plugins: configManager.build?.configurations?.svgo?.plugins ?? [
        {
          cleanupIDs: false,
        },
        {
          collapseGroups: false,
        },
      ],
    });

  config.module
    .rule('image')
    .test(/\.(png|jpe?g|gif|webp)$/)
    .set('type', 'asset')
    .set('generator', {
      emit: false,
    });

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
