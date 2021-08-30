import type Config from 'webpack-chain';
import autoprefixer from 'autoprefixer';
import imageSetPolyfill from 'postcss-image-set-polyfill';
import ExtractCssChunks from 'mini-css-extract-plugin';
import type { ConfigManager } from '../../../config/configManager';

const mediaVars = {
  PHONE: 599,
  TABLETS: 600,
  MOBILE: 1023,
  DESKTOP: 1024,
};

// eslint-disable-next-line import/no-default-export
export default (configManager: ConfigManager) => (config: Config) => {
  const { sourceMap } = configManager;

  config.module
    .rule('less')
    .test(/\.less$/)
    .use('extract-css')
    .loader(ExtractCssChunks.loader)
    .options({ esModule: false })
    .end()
    .use('css')
    .loader('css-loader')
    .options({
      sourceMap,
      esModule: false,
    })
    .end()
    .use('postcss')
    .loader('postcss-loader')
    .options({
      sourceMap,
      postcssOptions: {
        plugins: [
          imageSetPolyfill,
          autoprefixer({
            env: configManager.target,
          }),
        ],
      },
    })
    .end()
    .use('less')
    .loader('less-loader')
    .options({
      sourceMap,
      lessOptions: {
        globalVars: {
          mediaDesktop: mediaVars.DESKTOP,
          mediaMobile: mediaVars.MOBILE,
          mediaTablets: mediaVars.TABLETS,
          mediaPhone: mediaVars.PHONE,
        },
      },
    })
    .end();
};
