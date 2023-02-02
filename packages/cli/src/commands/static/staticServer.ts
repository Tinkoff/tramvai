import type { Server } from 'http';
import express from 'express';
import compression from 'compression';
import zlib from 'zlib';
import type { ConfigManager } from '../../config/configManager';
import type { ApplicationConfigEntry } from '../../typings/configEntry/application';

export const startStaticServer = (
  configManager: ConfigManager<ApplicationConfigEntry>
): Promise<Server> => {
  const { staticHost, staticPort } = configManager;
  const app = express();

  // WEB-389: Переключить на brotli после мержа https://github.com/expressjs/compression/pull/156
  app.use(
    compression({
      level: zlib.Z_DEFAULT_COMPRESSION,
    })
  );

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Timing-Allow-Origin', '*');

    next();
  });

  app.use(
    `/${configManager.output.client.replace(/\/$/, '')}/`,
    express.static(configManager.buildPath)
  );

  return new Promise((resolve) => {
    const server = app.listen(staticPort, staticHost.replace('localhost', '0.0.0.0'), () => {
      console.info('Running static server on port', staticPort); // eslint-disable-line no-console

      resolve(server);
    });
  });
};
