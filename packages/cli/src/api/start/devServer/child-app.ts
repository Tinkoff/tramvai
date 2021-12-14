import express from 'express';
import type { MultiCompiler } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import type { Container } from '@tinkoff/dippy';
import type { ConfigManager } from '../../../config/configManager';
import type { ModuleConfigEntry } from '../../../typings/configEntry/module';
import { close } from '../utils/close';
import type { STATIC_SERVER_TOKEN } from '../tokens';
import { CLOSE_HANDLER_TOKEN, WEBPACK_WATCHING_TOKEN } from '../tokens';

export const childAppDevServer = ({
  di,
  compiler,
  configManager,
  staticServer,
}: {
  di: Container;
  compiler: MultiCompiler;
  configManager: ConfigManager<ModuleConfigEntry>;
  staticServer: typeof STATIC_SERVER_TOKEN;
}) => {
  return async function devServer() {
    const app = express();
    const devMiddleware = webpackDevMiddleware(compiler, {
      headers: { 'Access-Control-Allow-Origin': '*' },
      publicPath: '',
    });

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

    app.use(`/${configManager.name}`, devMiddleware);

    staticServer.on('request', app);
  };
};
