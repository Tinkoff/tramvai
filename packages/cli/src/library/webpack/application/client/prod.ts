import webpack from 'webpack';
import Config from 'webpack-chain';
import crypto from 'crypto';
import path from 'path';

import isObject from '@tinkoff/utils/is/object';
import isUndefined from '@tinkoff/utils/is/undefined';

import ExtractCssPlugin from 'mini-css-extract-plugin';
// eslint-disable-next-line no-restricted-imports
import type { ForkTsCheckerWebpackPluginOptions } from 'fork-ts-checker-webpack-plugin/lib/ForkTsCheckerWebpackPluginOptions';
import RuntimePathPlugin from '../../plugins/RuntimePathPlugin';

import type { ConfigManager } from '../../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../../typings/configEntry/application';

import common from './common';
import optimize from '../../blocks/optimize';
import sourcemaps from '../../blocks/sourcemaps';
import commonProd from '../../common/client/prod';

// eslint-disable-next-line max-statements
export const webpackClientConfig = ({
  configManager,
}: {
  configManager: ConfigManager<ApplicationConfigEntry>;
}) => {
  const config = new Config();

  const { configurations } = configManager.build;

  config.batch(common(configManager));
  config.batch(commonProd(configManager));

  config.bail(true);

  config.output
    .path(configManager.getBuildPath())
    .publicPath('')
    .filename('[name].[contenthash].js')
    .chunkFilename('[name].[contenthash].chunk.js')
    .crossOriginLoading('anonymous')
    .chunkLoadTimeout(240000);

  config.output.set('chunkLoadingGlobal', 'wsp');

  let splitChunks: any = false;

  if (configurations.granularChunks) {
    splitChunks = {
      chunks: 'all',
      maxInitialRequests: 10,
      maxAsyncRequests: 20,
      cacheGroups: {
        default: false,
        defaultVendors: false,
        shared: {
          chunks: 'async',
          minChunks: configurations.granularChunksSplitNumber,
          minSize: configurations.granularChunksMinSize,
          reuseExistingChunk: true,
          name(module, chunks) {
            return crypto
              .createHash('sha1')
              .update(
                chunks.reduce((acc: string, chunk: webpack.Chunk) => {
                  return acc + chunk.name;
                }, '')
              )
              .digest('base64')
              .replace(/\//g, '');
          },
        },
      },
    };
  } else if (configurations.commonChunk) {
    splitChunks = {
      cacheGroups: {
        default: false,
        defaultVendors: false,
        commons: {
          name: 'common-chunk',
          minChunks: configurations.commonChunkSplitNumber,
        },
      },
    };
  }

  config.optimization
    .splitChunks(splitChunks)
    // namedChunks должно быть включено, чтобы webpack-flush-chunks смог определить имена чанков от которых зависит чанк бандла после обработчки через splitChunks
    .set('chunkIds', 'named');

  config.stats('minimal');

  config.plugin('extract-css').use(ExtractCssPlugin, [
    {
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].chunk.css',
      ignoreOrder: true,
    },
  ]);

  config.plugin('runtime-path').use(RuntimePathPlugin, [
    {
      publicPath: 'window.ap',
    },
  ]);

  config.plugin('loader-options').use(webpack.LoaderOptionsPlugin, [
    {
      minimize: false,
    },
  ]);

  config.batch(optimize(configManager));

  const { checkAsyncTs } = configManager.build.configurations;

  if (isObject(checkAsyncTs) && checkAsyncTs.failOnBuild) {
    const additionalOptions = isObject(checkAsyncTs) ? checkAsyncTs.pluginOptions || {} : {};
    const options: Partial<ForkTsCheckerWebpackPluginOptions> = {
      formatter: 'codeframe',
      ...additionalOptions,
      async: false,
    };
    const configFile = path.resolve(configManager.rootDir, './tsconfig.json');

    if (isUndefined(additionalOptions.typescript)) {
      options.typescript = { configFile };
    } else if (isObject(additionalOptions.typescript)) {
      options.typescript = {
        configFile,
        ...additionalOptions.typescript,
      };
    }

    config.plugin('fork-ts-checker').use(require('fork-ts-checker-webpack-plugin'), [options]);
  }

  if (configurations.sourceMap || configManager.debug) {
    config.batch(sourcemaps(configManager));
  }

  return config;
};
