import webpack from 'webpack';
import Config from 'webpack-chain';
import path from 'path';

import WebpackBar from 'webpackbar';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
// eslint-disable-next-line no-restricted-imports
import type { ForkTsCheckerWebpackPluginOptions } from 'fork-ts-checker-webpack-plugin/lib/plugin-options';

import isObject from '@tinkoff/utils/is/object';
import isUndefined from '@tinkoff/utils/is/undefined';

import RuntimePathPlugin from '../../plugins/RuntimePathPlugin';
import type { ApplicationConfigEntry } from '../../../../typings/configEntry/application';
import type { ConfigManager } from '../../../../config/configManager';
import common from './common';
import commonDev from '../../common/dev';
import { commonApplicationDev } from '../dev';
import type { UI_SHOW_PROGRESS_TOKEN } from '../../../../di/tokens';
import sourcemaps from '../../blocks/sourcemaps';
import FancyReporter from '../../plugins/WebpackBar/reporters/fancy';
import { extendEntry } from '../../utils/extendEntry';
import { extractCssPluginFactory } from '../../blocks/extractCssPlugin';
import { splitChunksConfig } from './prod/optimization/splitChunks';

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
  config.batch(commonDev(configManager));
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
  } else {
    config.watchOptions(
      configManager.webpack.watchOptions ?? {
        aggregateTimeout: 5,
        ignored: ['**/node_modules/**', '**/.git/**'],
      }
    );
  }

  config.output
    .path(configManager.buildPath)
    .publicPath(
      `http://${configManager.staticHost}:${
        configManager.staticPort
      }/${configManager.output.client.replace(/\/$/, '')}/`
    )
    .filename('[name].js')
    .chunkFilename('[name].chunk.js')
    .crossOriginLoading('anonymous');

  config.output.set('chunkLoadingGlobal', 'wsp');

  config.optimization.set('emitOnErrors', false);

  config.batch(
    extractCssPluginFactory(configManager, {
      filename: '[name].css',
      chunkFilename: '[name].chunk.css',
    })
  );

  if (showProgress) {
    config.plugin('progress').use(WebpackBar, [
      {
        name: 'client',
        reporters: [new FancyReporter()],
      },
    ]);

    if (configManager.profile) {
      config
        .plugin('progress')
        .tap((args) => [{ ...args[0], profile: true, reporters: ['profile'] }]);
    }
  }

  const { checkAsyncTs } = configManager;

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

  // window.ap выставляется в packages/modules/render/src/server/blocks/bundleResource/bundleResource.ts
  // в development сборке, window.ap будет проставлен только если есть валидный ASSETS_PREFIX,
  // поэтому меняем publicPath на window.ap только при таком же условии
  if (process.env.ASSETS_PREFIX && process.env.ASSETS_PREFIX !== 'static') {
    config.plugin('runtime-path').use(RuntimePathPlugin, [
      {
        publicPath: 'window.ap',
      },
    ]);
  }

  config.plugin('define').tap((args) => [
    {
      ...args[0],
      'process.env.NODE_ENV': JSON.stringify('development'),
    },
  ]);

  config.batch(splitChunksConfig(configManager));

  const { hotRefresh } = configManager;

  if (hotRefresh?.enabled) {
    extendEntry(config.entry('platform'), {
      import: [
        'webpack-hot-middleware/client?name=client&dynamicPublicPath=true&path=__webpack_hmr',
      ],
    });

    config.plugin('hot-module').use(webpack.HotModuleReplacementPlugin);
    config.plugin('react-refresh').use(ReactRefreshPlugin, [
      {
        ...hotRefresh.options,
        overlay:
          typeof hotRefresh.options?.overlay === 'boolean'
            ? hotRefresh.options.overlay
            : {
                ...hotRefresh.options?.overlay,
              },
      },
    ]);
  }

  return config;
};
