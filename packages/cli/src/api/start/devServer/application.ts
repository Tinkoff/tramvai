import express from 'express';
import type { MultiCompiler } from 'webpack';
import type Config from 'webpack-chain';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import type { Container } from '@tinkoff/dippy';
import { notifier } from './notifier';
import type { ConfigManager } from '../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../typings/configEntry/application';
import { CONFIG_ROOT_DIR_TOKEN, UI_OS_NOTIFY_TOKEN } from '../../../di/tokens';
import type { STATIC_SERVER_TOKEN } from '../tokens';
import { CLOSE_HANDLER_TOKEN, WEBPACK_WATCHING_TOKEN } from '../tokens';
import { close } from '../utils/close';

export const applicationDevServer = ({
  di,
  compiler,
  configManager,
  clientConfig,
  staticServer,
}: {
  di: Container;
  compiler: MultiCompiler;
  configManager: ConfigManager<ApplicationConfigEntry>;
  clientConfig: Config | null;
  staticServer: typeof STATIC_SERVER_TOKEN;
}) => {
  return async function devServer() {
    const rootDir = di.get(CONFIG_ROOT_DIR_TOKEN);
    const app = express();

    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');

      next();
    });

    const devMiddleware = webpackDevMiddleware(compiler);

    app.use(devMiddleware);

    di.register({
      provide: WEBPACK_WATCHING_TOKEN,
      useValue: devMiddleware.context.watching,
    });

    di.register({
      provide: CLOSE_HANDLER_TOKEN,
      multi: true,
      useValue: () => {
        return close(compiler);
      },
    });

    if (configManager.hotRefresh) {
      app.use(
        `/${configManager.build.options.outputClient}`,
        webpackHotMiddleware(compiler, { log: false })
      );
    }

    app.use(express.static(rootDir));

    if (di.get({ token: UI_OS_NOTIFY_TOKEN, optional: true })) {
      notifier(compiler, configManager);
    }

    staticServer.on('request', app);
  };
};
