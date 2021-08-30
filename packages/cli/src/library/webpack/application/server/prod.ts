import Config from 'webpack-chain';
import TerserPlugin from 'terser-webpack-plugin';

import type { ConfigManager } from '../../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../../typings/configEntry/application';

import RuntimePathPlugin from '../../plugins/RuntimePathPlugin';
import common from './common';
import sourcemaps from '../../blocks/sourcemaps';
import commonProd from '../../common/server/prod';

export const webpackServerConfig = ({
  configManager,
}: {
  configManager: ConfigManager<ApplicationConfigEntry>;
}) => {
  const config = new Config();
  const { debug } = configManager;

  const {
    configurations: { sourceMapServer },
  } = configManager.build;

  config.batch(common(configManager));
  config.batch(commonProd(configManager));

  config.bail(true);

  config.externals(
    (configManager.build.configurations.externals || []).map((s) => new RegExp(`^${s}`))
  );

  if (!configManager.disableProdOptimization) {
    config.plugin('terser').use(TerserPlugin, [
      {
        extractComments: false,
        terserOptions: {
          ecma: 5, // на сервере в страницу встраивается код, который может подключаться через import и terser его соптимизирует в es6
          mangle: false,
          // сохраняем имена функций, чтобы легче было найти ошибку в трамвае
          keep_fnames: true,
          compress: {
            drop_debugger: !debug,
            dead_code: true,
          },
          output: {
            comments: false,
          },
        },
      },
    ]);
  }

  // RuntimePathPlugin необходим для правильной генерации ссылок на ассеты (картинки и т.п. которые грузятся через file-loader или url-loader)
  config.plugin('runtime-path').use(RuntimePathPlugin, [
    {
      publicPath: 'process.env.ASSETS_PREFIX',
    },
  ]);

  if (sourceMapServer || debug) {
    config.batch(sourcemaps(configManager));
  }

  return config;
};
