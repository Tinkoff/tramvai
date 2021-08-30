import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../config/configManager';

export default (configManager: ConfigManager) => (config: Config) => {
  config.module
    .rule('woff')
    .test(/\.woff$/)
    .use('url')
    .loader('url-loader')
    .options({
      limit: 1000,
      mimetype: 'application/font-woff',
    });

  config.module
    .rule('ttf')
    .test(/\.ttf$/)
    .use('url')
    .loader('url-loader')
    .options({
      limit: 1000,
      mimetype: 'application/octet-stream',
    });

  config.module
    .rule('eot')
    .test(/\.eot$/)
    .use('file')
    .loader('file-loader');

  config.module
    .rule('svg')
    .test(/\.svg$/)
    .use('file')
    .loader('file-loader')
    .options({
      name: '[md5:hash:hex].[ext]',
    })
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
    .use('url')
    .loader('url-loader')
    .options({
      limit: 1000,
      mimetype: 'image/png',
    });

  config.module
    .rule('gif')
    .test(/\.gif$/)
    .use('url')
    .loader('url-loader')
    .options({
      limit: 1000,
      mimetype: 'image/gif',
    });

  config.module
    .rule('jpg')
    .test(/\.jpg$/)
    .use('url')
    .loader('url-loader')
    .options({
      limit: 1000,
      mimetype: 'image/jpg',
    });

  config.module
    .rule('mp4')
    .test(/\.mp4$/)
    .use('file')
    .loader('file-loader');

  config.module
    .rule('webm')
    .test(/\.webm$/)
    .use('file')
    .loader('file-loader');

  config.module
    .rule('webp')
    .test(/\.webp$/)
    .use('url')
    .loader('url-loader')
    .options({
      limit: 1000,
      mimetype: 'image/webp',
    });

  config.module
    .rule('avif')
    .test(/\.avif$/)
    .use('url')
    .loader('url-loader')
    .options({
      limit: 1000,
      mimetype: 'image/avif',
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
