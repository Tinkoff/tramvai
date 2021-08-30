import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../config/configManager';

export default (configManager: ConfigManager) => (config: Config) => {
  config.module
    .rule('svg')
    .test(/\.svg$/)
    .use('file')
    .loader('raw-loader')
    .end()
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
    .rule('png')
    .test(/\.png$/)
    .use('file')
    .loader('url-loader')
    .options({
      limit: 1000,
      mimetype: 'image/png',
      fallback: 'file-loader',
      emitFile: false, // применится к лоадеру указанному в fallback (https://github.com/webpack-contrib/url-loader/issues/118#issuecomment-372314898)
    });

  config.module
    .rule('gif')
    .test(/\.gif$/)
    .use('file')
    .loader('file-loader')
    .options({
      emitFile: false,
    });

  config.module
    .rule('jpg')
    .test(/\.jpg$/)
    .use('file')
    .loader('file-loader')
    .options({
      emitFile: false,
    });

  config.module
    .rule('mp4')
    .test(/\.mp4$/)
    .use('file')
    .loader('file-loader')
    .options({
      emitFile: false,
    });

  config.module
    .rule('webm')
    .test(/\.webm$/)
    .use('file')
    .loader('file-loader')
    .options({
      emitFile: false,
    });

  config.module
    .rule('webp')
    .test(/\.webp$/)
    .use('file')
    .loader('file-loader')
    .options({
      emitFile: false,
    });

  config.module
    .rule('avif')
    .test(/\.avif$/)
    .use('file')
    .loader('file-loader')
    .options({
      emitFile: false,
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
