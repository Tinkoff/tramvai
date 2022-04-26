import webpack from 'webpack';
import Config from 'webpack-chain';
import path from 'path';

import isObject from '@tinkoff/utils/is/object';
import isUndefined from '@tinkoff/utils/is/undefined';

// eslint-disable-next-line no-restricted-imports
import type { ForkTsCheckerWebpackPluginOptions } from 'fork-ts-checker-webpack-plugin/lib/ForkTsCheckerWebpackPluginOptions';
import RuntimePathPlugin from '../../plugins/RuntimePathPlugin';

import type { ConfigManager } from '../../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../../typings/configEntry/application';

import common from './common';
import optimize from '../../blocks/optimize';
import sourcemaps from '../../blocks/sourcemaps';
import commonProd from '../../common/client/prod';
import { extractCssPluginFactory } from '../../blocks/extractCssPlugin';
import { splitChunksConfig } from './prod/optimization/splitChunks';

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

  config.batch(splitChunksConfig(configManager));

  config.optimization
    // namedChunks должно быть включено, чтобы webpack-flush-chunks смог определить имена чанков от которых зависит чанк бандла после обработчки через splitChunks
    .set('chunkIds', 'named');

  config.stats('minimal');

  config.batch(
    extractCssPluginFactory(configManager, {
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].chunk.css',
    })
  );

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
