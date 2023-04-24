import * as path from 'path';
import fetch from 'node-fetch';

import type { WebpackStats, FETCH_WEBPACK_STATS_TOKEN } from '@tramvai/tokens-render';
import type { appConfig as AppConfig } from '@tramvai/cli/lib/external/config';

import { requireFunc } from './requireFunc';

let appConfig: typeof AppConfig;

try {
  appConfig = require('@tramvai/cli/lib/external/config').appConfig;
} catch (e) {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error while reading app config', e);
  }
}

let fetchStats: (modern: boolean) => Promise<WebpackStats> = async () => {
  throw new Error(`Unknown environment`);
};

if (process.env.NODE_ENV === 'development') {
  fetchStats = async () => {
    const { modern: configModern, staticHost, staticPort, output } = appConfig;

    const getUrl = (filename: string) =>
      `http://${staticHost}:${staticPort}/${output.client}/${filename}`;

    const request = await fetch(getUrl(configModern ? 'stats.modern.json' : 'stats.json'));
    const stats = await request.json();
    // static - популярная заглушка в env.development.js файлах, надо игнорировать, как было раньше
    const hasAssetsPrefix = process.env.ASSETS_PREFIX && process.env.ASSETS_PREFIX !== 'static';

    const publicPath = hasAssetsPrefix ? process.env.ASSETS_PREFIX : stats.publicPath;

    return {
      ...stats,
      publicPath,
    };
  };
}

if (process.env.NODE_ENV === 'test') {
  fetchStats = () => {
    // mock for unit-testing as there is no real static return something just to make server render work
    return Promise.resolve({
      publicPath: 'http://localhost:4000/',
      assetsByChunkName: {},
      entrypoints: {},
    });
  };
}

if (process.env.NODE_ENV === 'production') {
  const SEARCH_PATHS = [process.cwd(), __dirname];

  const webpackStats = (fileName: string) => {
    let stats;

    for (const dir of SEARCH_PATHS) {
      try {
        const statsPath = path.resolve(dir, fileName);
        stats = requireFunc(statsPath);
        break;
      } catch (e) {
        // ignore errors as this function is used to load stats for several optional destinations
        // and these destinations may not have stats file
      }
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

  const statsLegacy = webpackStats('stats.json');

  const statsModern = webpackStats('stats.modern.json') || statsLegacy;

  if (!statsLegacy) {
    throw new Error(`Cannot find stats.json.
  It should be placed in one of the next places:
    ${SEARCH_PATHS.join('\n\t')}
  In case it happens on deployment:
    - In case you are using two independent jobs for building app
      - Either do not split build command by two independent jobs and use one common job with "tramvai build" command without --buildType
      - Or copy stats.json (and stats.modern.json if present) file from client build output to server output by yourself in your CI
    - Otherwise report issue to tramvai team
  In case it happens locally:
    - prefer to use command "tramvai start-prod" to test prod-build locally
    - copy stats.json next to built server.js file
`);
  }
  fetchStats = (modern: boolean) => {
    const stats = modern ? statsModern : statsLegacy;

    return Promise.resolve(stats);
  };
}

export const fetchWebpackStats: typeof FETCH_WEBPACK_STATS_TOKEN = async ({ modern } = {}) => {
  return fetchStats(modern);
};
