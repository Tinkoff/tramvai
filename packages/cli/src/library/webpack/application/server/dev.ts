import path from 'path';
import Config from 'webpack-chain';
import WebpackBar from 'webpackbar';

import type { ConfigManager } from '../../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../../typings/configEntry/application';

import RuntimePathPlugin from '../../plugins/RuntimePathPlugin';
import common from './common';
import commonDev from '../../common/dev';
import { commonApplicationDev } from '../common';
import configResolve from '../../blocks/configResolve';
import type { UI_SHOW_PROGRESS_TOKEN } from '../../../../di/tokens';
import sourcemaps from '../../blocks/sourcemaps';

export const webpackServerConfig = ({
  configManager,
  showProgress,
}: {
  configManager: ConfigManager<ApplicationConfigEntry>;
  showProgress: typeof UI_SHOW_PROGRESS_TOKEN | null;
}) => {
  const { options: { server = '' } = {} } = configManager.build;
  const config = new Config();

  config.batch(common(configManager));
  config.batch(commonDev());
  config.batch(
    commonApplicationDev({
      entry: path.resolve(configManager.rootDir, server),
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
    (configManager.build.configurations.externals || [])
      .concat(configManager.serve.configurations.externals || [])
      .map((s) => new RegExp(`^${s}`))
  );

  config.optimization.set('emitOnErrors', false);

  if (showProgress) {
    config.plugin('progress').use(WebpackBar, [
      {
        name: 'server',
        color: 'orange',
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

  // RuntimePathPlugin необходим для правильной генерации ссылок на ассеты (картинки и т.п. которые грузятся через file-loader или url-loader)
  config.plugin('runtime-path').use(RuntimePathPlugin, [
    {
      publicPath: `"http://${configManager.staticHost}:${
        configManager.staticPort
      }/${configManager.build.options.outputClient.replace(/\/$/, '')}/"`,
    },
  ]);

  return config;
};
