import webpack from 'webpack';
import Config from 'webpack-chain';
import path from 'path';

import ExtractCssPlugin from 'mini-css-extract-plugin';
import WebpackBar from 'webpackbar';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
// eslint-disable-next-line no-restricted-imports
import type { ForkTsCheckerWebpackPluginOptions } from 'fork-ts-checker-webpack-plugin/lib/ForkTsCheckerWebpackPluginOptions';

import isObject from '@tinkoff/utils/is/object';
import isUndefined from '@tinkoff/utils/is/undefined';

import type { ApplicationConfigEntry } from '../../../../typings/configEntry/application';
import type { ConfigManager } from '../../../../config/configManager';
import common from './common';
import commonDev from '../../common/dev';
import { commonApplicationDev } from '../common';
import type { UI_SHOW_PROGRESS_TOKEN } from '../../../../di/tokens';
import sourcemaps from '../../blocks/sourcemaps';

// eslint-disable-next-line max-statements
export const webpackClientConfig = ({
  configManager,
  showProgress,
}: {
  configManager: ConfigManager<ApplicationConfigEntry>;
  showProgress: typeof UI_SHOW_PROGRESS_TOKEN | null;
}) => {
  const config = new Config();

  config.batch(common(configManager));
  config.batch(commonDev());
  config.batch(
    commonApplicationDev({
      entry: path.resolve(configManager.rootDir, `${configManager.root}/index`),
      onlyBundles: configManager.onlyBundles,
    })
  );

  config.mode('development');

  config.devtool('eval');

  if (configManager.sourceMap) {
    config.batch(sourcemaps(configManager));
  }

  if (configManager.noClientRebuild) {
    config.watchOptions({
      ignored: /.*/,
    });
  }

  config.output
    .path(configManager.getBuildPath())
    .publicPath(
      `http://${configManager.staticHost}:${
        configManager.staticPort
      }/${configManager.build.options.outputClient.replace(/\/$/, '')}/`
    )
    .filename('[name].js')
    .chunkFilename('[name].chunk.js')
    .crossOriginLoading('anonymous');

  config.output.set('chunkLoadingGlobal', 'wsp');

  config.optimization.set('emitOnErrors', false);

  config.plugin('extract-css').use(ExtractCssPlugin, [
    {
      filename: '[name].css',
      chunkFilename: '[name].chunk.css',
      ignoreOrder: true,
    },
  ]);

  if (showProgress) {
    config.plugin('progress').use(WebpackBar, [
      {
        name: 'client',
      },
    ]);

    if (configManager.profile) {
      config
        .plugin('progress')
        .tap((args) => [{ ...args[0], profile: true, reporters: ['profile'] }]);
    }
  }

  const { checkAsyncTs } = configManager.build.configurations;

  if (checkAsyncTs) {
    const additionalOptions = isObject(checkAsyncTs) ? checkAsyncTs.pluginOptions || {} : {};
    const options: Partial<ForkTsCheckerWebpackPluginOptions> = {
      formatter: 'codeframe',
      async: true,
      ...additionalOptions,
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

  config.plugin('define').tap((args) => [
    {
      ...args[0],
      'process.env.NODE_ENV': JSON.stringify('development'),
    },
  ]);

  if (configManager.hotRefresh) {
    const { configurations: { hotRefreshOptions = {} } = {} } = configManager.serve;

    const splitChunks = {
      cacheGroups: {
        default: false,
        defaultVendors: false,
        commons: {
          name: 'hmr',
          enforce: true,
          test: /[\\/]node_modules[\\/](react-refresh|webpack-hot-middleware|@pmmmwh[\\/]react-refresh-webpack-plugin)[\\/]/,
          chunks: 'all',
        },
      },
    };

    config.optimization.splitChunks(splitChunks).set('chunkIds', 'named');

    const platformEntry = config.entry('platform').values()[0];

    if (
      typeof platformEntry === 'object' &&
      'import' in platformEntry &&
      typeof platformEntry.import === 'string'
    ) {
      config
        .entry('platform')
        .clear()
        .add({
          ...platformEntry,
          import: [
            'webpack-hot-middleware/client?name=client&dynamicPublicPath=true&path=__webpack_hmr',
            platformEntry.import,
          ],
        });
    }

    config.plugin('hot-module').use(webpack.HotModuleReplacementPlugin);
    config.plugin('react-refresh').use(ReactRefreshPlugin, [
      {
        ...hotRefreshOptions,
        overlay:
          typeof hotRefreshOptions.overlay === 'boolean'
            ? hotRefreshOptions.overlay
            : {
                ...hotRefreshOptions.overlay,
              },
      },
    ]);
  }

  return config;
};
