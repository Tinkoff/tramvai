import Config from 'webpack-chain';
import WebpackBar from 'webpackbar';
import webpack from 'webpack';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import type { ConfigManager } from '../../../../config/configManager';
import common from './common';
import commonDev from '../../common/dev';
import type { UI_SHOW_PROGRESS_TOKEN } from '../../../../di/tokens';
import { extendEntry } from '../../utils/extendEntry';
import type { ChildAppConfigEntry } from '../../../../typings/configEntry/child-app';

export const webpackClientConfig = ({
  configManager,
  showProgress,
}: {
  configManager: ConfigManager<ChildAppConfigEntry>;
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

  const { hotRefresh } = configManager;

  if (hotRefresh?.enabled) {
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

    extendEntry(config.entry(configManager.name), {
      import: [
        'webpack-hot-middleware/client?name=client&dynamicPublicPath=true&path=__webpack_hmr',
      ],
    });
  }

  return config;
};
