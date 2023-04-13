import path from 'path';
import Config from 'webpack-chain';
import WebpackBar from 'webpackbar';

import type { ConfigManager } from '../../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../../typings/configEntry/application';

import RuntimePathPlugin from '../../plugins/RuntimePathPlugin';
import common from './common';
import commonDev from '../../common/dev';
import { commonApplicationDev } from '../dev';
import configResolve from '../../blocks/configResolve';
import type { UI_SHOW_PROGRESS_TOKEN } from '../../../../di/tokens';
import sourcemaps from '../../blocks/sourcemaps';
import FancyReporter from '../../plugins/WebpackBar/reporters/fancy';

export const webpackServerConfig = ({
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
  config.batch(configResolve(configManager));

  config.mode('development');

  if (configManager.sourceMap) {
    config.batch(sourcemaps(configManager));
  }

  if (configManager.noServerRebuild) {
    config.watchOptions({
      ignored: /.*/,
    });
  }

  config.externals(
    ['react$', 'react-dom', 'prop-types', 'fastify', 'core-js', ...configManager.externals].map(
      (s) => new RegExp(`^${s}`)
    )
  );

  config.optimization.set('emitOnErrors', false);

  if (showProgress) {
    config.plugin('progress').use(WebpackBar, [
      {
        name: 'server',
        color: 'orange',
        reporters: [new FancyReporter()],
      },
    ]);

    if (configManager.profile) {
      config
        .plugin('progress')
        .tap((args) => [{ ...args[0], profile: true, reporters: ['profile'] }]);
    }
  }

  config.plugin('define').tap((args) => [
    {
      ...args[0],
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.HOST_STATIC': JSON.stringify(configManager.staticHost),
      'process.env.PORT_STATIC': JSON.stringify(configManager.staticPort),
    },
  ]);

  config.plugin('runtime-path').use(RuntimePathPlugin, [
    {
      publicPath:
        process.env.ASSETS_PREFIX ??
        `"http://${configManager.staticHost}:${
          configManager.staticPort
        }/${configManager.output.client.replace(/\/$/, '')}/"`,
    },
  ]);

  return config;
};
