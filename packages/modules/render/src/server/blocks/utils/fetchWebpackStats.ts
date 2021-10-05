import * as path from 'path';

import { requireFunc } from './requireFunc';

let appConfig;

try {
  // eslint-disable-next-line import/no-extraneous-dependencies
  appConfig = require('@tramvai/cli/lib/external/config').appConfig;
} catch (e) {}

export type WebpackStats = {
  assetsByChunkName: Record<string, string[]>;
  namedChunkGroups?: Record<string, { name: string; chunks: string[] }>;
  publicPath: string;
  [key: string]: any;
};

const webpackStats = (paths: string[]) => {
  let stats;

  try {
    const statsPath = path.resolve(...paths);
    stats = requireFunc(statsPath);
  } catch (e) {
    // ignore errors as this function is used to load stats for several optional destinations
    // and these destinations may not have stats file
  }

  if (!stats) {
    return;
  }

  if (!process.env.ASSETS_PREFIX) {
    if (process.env.STATIC_PREFIX) {
      throw new Error(
        'Required env variable "ASSETS_PREFIX" is not set. Instead of using "STATIC_PREFIX" env please define "ASSETS_PREFIX: STATIC_PREFIX + /compiled"'
      );
    }

    throw new Error('Required env variable "ASSETS_PREFIX" is not set');
  }

  return {
    ...stats,
    publicPath: process.env.ASSETS_PREFIX,
  };
};

const statsLegacy =
  webpackStats(['stats.json']) ||
  // try to find stats.json nearby server.js file
  webpackStats([__dirname, 'stats.json']);

const statsModern = webpackStats(['stats.modern.json']) || statsLegacy;

const request = (url: string): Promise<WebpackStats> => {
  const http = require('http');

  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', (e) => {
        reject(e);
      });
  });
};

const fallbackDevStats = async () => {
  const host = process.env.HOST_STATIC || 'localhost';
  const port = process.env.PORT_STATIC || 4000;
  const outputClient = process.env.PATH_STATIC || 'dist/client';

  const getUrl = (filename: string) => `http://${host}:${port}/${outputClient}/${filename}`;

  const stats =
    (await request(getUrl('stats.modern.json'))) || (await request(getUrl('stats.json')));

  if (!stats) {
    throw new Error(
      'stats.json файл не найден, если в platform.json переопределяется outputClient для приложения, ' +
        'то необходимо задать переменную окружения PATH_STATIC=[значение из outputClient]'
    );
  }

  return stats;
};

export const fetchWebpackStats = async ({
  modern,
}: {
  modern?: boolean;
} = {}): Promise<WebpackStats> => {
  /*
   * В дев режиме забираем удаленно со статики,
   * в продакшне из локального файла
   * */

  if (process.env.NODE_ENV === 'development') {
    // TODO: убрать fallbackDevStats после того как все обновятся до актуальной версии @tramvai/cli
    if (!appConfig) {
      return fallbackDevStats();
    }

    const {
      modern: configModern,
      staticHost,
      staticPort,
      build: {
        options: { outputClient },
      },
    } = appConfig;

    const getUrl = (filename: string) =>
      `http://${staticHost}:${staticPort}/${outputClient}/${filename}`;

    const stats = await request(getUrl(configModern ? 'stats.modern.json' : 'stats.json'));
    // static - популярная заглушка в env.development.js файлах, надо игнорировать, как было раньше
    const hasAssetsPrefix = process.env.ASSETS_PREFIX && process.env.ASSETS_PREFIX !== 'static';

    const publicPath = hasAssetsPrefix ? process.env.ASSETS_PREFIX : stats.publicPath;

    return {
      ...stats,
      publicPath,
    };
  }

  if (process.env.NODE_ENV === 'test') {
    // мок результата для юнит-тестов, т.к. никакой статики у нас на самом деле нет, указываем какую-то, чтобы сформировать урлы в ответе сервера
    return Promise.resolve({ publicPath: 'http://localhost:4000/', assetsByChunkName: {} });
  }

  const stats = modern ? statsModern : statsLegacy;

  if (!stats) {
    return Promise.reject(new Error('Cannot find stats.json'));
  }

  return Promise.resolve(stats);
};
