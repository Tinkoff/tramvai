import type Config from 'webpack-chain';
import SparkMD5 from 'spark-md5';
import type { ConfigManager } from '../../../config/configManager';

export const filesClientWebackRulesFactory = (configManager: ConfigManager) => (config: Config) => {
  config.module
    .rule('woff')
    .test(/\.woff2?$/)
    .set('type', 'asset');

  config.module
    .rule('svg')
    .test(/\.svg$/)
    .set('type', 'asset/resource')
    .set('generator', {
      filename: (pathInfo) => {
        // hash computation exactly how it is working in react-ui-kit
        // TODO: it leads to high coherence with ui-kit, better change it to some other method
        return `${SparkMD5.hash(pathInfo.module.originalSource().source().toString())}.svg`;
      },
    })
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
    .set('type', 'asset');

  config.module
    .rule('video')
    .test(/\.(mp4|webm|avif)$/)
    .set('type', 'asset/resource');

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

export default filesClientWebackRulesFactory;
