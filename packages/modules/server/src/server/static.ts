import zlib from 'zlib';
import express from 'express';
import compression from 'compression';
import type { LOGGER_TOKEN, ENV_MANAGER_TOKEN } from '@tramvai/module-common';
import type { APP_INFO_TOKEN } from '@tramvai/core';
import os from 'os';

interface StaticAppOptions {
  port?: number;
  log: any;
}

export const staticAppCommand = ({
  logger,
  envManager,
  appInfo,
}: {
  logger: typeof LOGGER_TOKEN;
  envManager: typeof ENV_MANAGER_TOKEN;
  appInfo: typeof APP_INFO_TOKEN;
}) => {
  if (!envManager.get('DEV_STATIC')) {
    return function staticAppNoop() {};
  }

  const log = logger('server:static');
  const port = +envManager.get('PORT_STATIC');
  const appVersion = envManager.get('APP_VERSION');

  return function staticApp() {
    const appStatic = express();

    appStatic.disable('x-powered-by');

    // WEB-389: Переключить на brotli после мержа https://github.com/expressjs/compression/pull/156
    appStatic.use(
      compression({
        level: zlib.Z_DEFAULT_COMPRESSION,
      })
    );

    appStatic.use((_, res, next) => {
      res.set({
        'Access-Control-Allow-Origin': '*',
        'X-App-Id': appInfo.appName,
        'X-App-Version': appVersion,
        'X-Host': os.hostname(),
      });

      next();
    });

    appStatic.use('/', express.static('./'));
    appStatic.listen(port, () => log.info(`Running static server on port: ${port}`));

    return appStatic;
  };
};
