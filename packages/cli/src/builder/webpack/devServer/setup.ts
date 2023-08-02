import express from 'express';
import type { MultiCompiler } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import type { Container } from '@tinkoff/dippy';
import type { ConfigManager } from '../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../typings/configEntry/application';
import type { STATIC_SERVER_TOKEN } from '../../../di/tokens';
import { CONFIG_ROOT_DIR_TOKEN } from '../../../di/tokens';
import { WEBPACK_WATCHING_TOKEN, CLOSE_HANDLER_TOKEN } from '../tokens';
import { close } from '../../../utils/close';
import { isApplication, isChildApp, isModule } from '../../../config/validate';

const getPrefix = (configManager: ConfigManager): string => {
  if (isApplication(configManager)) {
    return '/';
  }

  if (isChildApp(configManager)) {
    return `/${configManager.name}`;
  }

  if (isModule(configManager)) {
    return `/${configManager.name}/:version`;
  }

  throw new Error(`${configManager.type} is not supported`);
};

const getHotModulePrefix = (configManager: ConfigManager): string => {
  if (isApplication(configManager)) {
    return `/${configManager.output.client}`;
  }

  if (isChildApp(configManager)) {
    return `/${configManager.name}`;
  }

  if (isModule(configManager)) {
    return `/${configManager.name}/:version`;
  }

  throw new Error(`${configManager.type} is not supported`);
};

export const createDevServer = ({
  di,
  compiler,
  configManager,
  staticServer,
}: {
  di: Container;
  compiler: MultiCompiler;
  configManager: ConfigManager<ApplicationConfigEntry>;
  staticServer: typeof STATIC_SERVER_TOKEN;
}) => {
  return async function devServer() {
    const app = express();

    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Timing-Allow-Origin', '*');

      next();
    });

    const devMiddleware = webpackDevMiddleware(compiler);

    app.use(getPrefix(configManager), devMiddleware);

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

    if (configManager.hotRefresh.enabled) {
      app.use(getHotModulePrefix(configManager), webpackHotMiddleware(compiler, { log: false }));
    }

    const rootDir = di.get(CONFIG_ROOT_DIR_TOKEN);
    app.use(express.static(rootDir));

    staticServer.on('request', app);
  };
};
