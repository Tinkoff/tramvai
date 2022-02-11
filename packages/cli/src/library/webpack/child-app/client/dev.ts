import Config from 'webpack-chain';
import WebpackBar from 'webpackbar';
import webpack from 'webpack';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import type { ConfigManager } from '../../../../config/configManager';
import type { ModuleConfigEntry } from '../../../../typings/configEntry/module';
import common from './common';
import commonDev from '../../common/dev';
import type { UI_SHOW_PROGRESS_TOKEN } from '../../../../di/tokens';
import { extendEntry } from '../../utils/extendEntry';

export const webpackClientConfig = ({
  configManager,
  showProgress,
}: {
  configManager: ConfigManager<ModuleConfigEntry>;
  showProgress: typeof UI_SHOW_PROGRESS_TOKEN | null;
}) => {
  const config = new Config();

  config.batch(common(configManager));
  config.batch(commonDev());

  config.mode('development');

  if (showProgress) {
    config.plugin('progress').use(WebpackBar, [
      {
        name: 'child-app-client',
      },
    ]);
  }

  config.plugin('define').tap((args) => [
    {
      ...args[0],
      'process.env.NODE_ENV': '"development"',
    },
  ]);

  if (configManager.hotRefresh) {
    const { configurations: { hotRefreshOptions = {} } = {} } = configManager.serve;

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

    extendEntry(config.entry(configManager.name), {
      import: [
        'webpack-hot-middleware/client?name=client&dynamicPublicPath=true&path=__webpack_hmr',
      ],
    });
  }

  return config;
};
