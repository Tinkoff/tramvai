import express from 'express';
import type { MultiCompiler } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import type { Container } from '@tinkoff/dippy';
import type { ConfigManager } from '../../../config/configManager';
import type { ModuleConfigEntry } from '../../../typings/configEntry/module';
import { close } from '../utils/close';
import type { STATIC_SERVER_TOKEN } from '../tokens';
import { CLOSE_HANDLER_TOKEN, WEBPACK_WATCHING_TOKEN } from '../tokens';

export const moduleDevServer = ({
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
    const devMiddleware = webpackDevMiddleware(compiler as any, {
      headers: { 'Access-Control-Allow-Origin': '*' },
      publicPath: '',
    });

    di.register({
      provide: WEBPACK_WATCHING_TOKEN,
      useValue: devMiddleware.context.watching,
    });
    // нужно закрыть watch режим вебпака, но т.к. он стартует только в рамках devMiddleware, то
    // и остановить его можно пока только через devMiddleware, в webpack5 обещают исправить
    di.register({
      provide: CLOSE_HANDLER_TOKEN,
      multi: true,
      useValue: () => {
        return close(devMiddleware);
      },
    });

    app.use(`/${configManager.name}/:version`, devMiddleware);

    staticServer.on('request', app);
  };
};
