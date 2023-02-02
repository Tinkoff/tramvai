import path from 'path';
import fs from 'fs';
import type Config from 'webpack-chain';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

import type { ConfigManager } from '../../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../../typings/configEntry/application';

import common from '../../common/main';
import { commonApplication } from '../common';
import files from '../../blocks/filesClient';
import ts from '../../blocks/ts';
import js from '../../blocks/js';
import less from '../../blocks/less';
import css from '../../blocks/css';
import postcssAssets from '../../blocks/postcssAssets';
import nodeClient from '../../blocks/nodeClient';
import { pagesResolve } from '../../blocks/pagesResolve';
import { DEFAULT_STATS_OPTIONS, DEFAULT_STATS_FIELDS } from '../../constants/stats';
import { configToEnv } from '../../blocks/configToEnv';
import { safeRequireResolve } from '../../../../utils/safeRequire';

export default (configManager: ConfigManager<ApplicationConfigEntry>) => (config: Config) => {
  const { polyfill, fileSystemPages } = configManager;

  config.name('client');

  config.batch(common(configManager));
  config.batch(commonApplication(configManager));
  config.batch(files(configManager));

  if (fileSystemPages.enabled) {
    config.batch(pagesResolve(configManager));
  }

  const portal = path.resolve(configManager.rootDir, `packages/${process.env.APP_ID}/portal.js`);

  config.target(configManager.modern ? 'web' : ['web', 'es5']);

  config.batch(configToEnv(configManager));

  config
    .entry('platform')
    .add(path.resolve(configManager.rootDir, `${configManager.root}/index`))
    .end()
    .when(fs.existsSync(portal), (cfg) => cfg.entry('portal').add(portal))
    .plugin('define')
    .tap((args) => [
      {
        ...args[0],
        'process.env.BROWSER': true,
        'process.env.SERVER': false,
      },
    ])
    .end();

  const polyfillPath = path.resolve(configManager.rootDir, polyfill ?? 'src/polyfill');

  if (safeRequireResolve(polyfillPath, typeof polyfill === 'undefined')) {
    config.entry('polyfill').add(polyfillPath);
  }

  const statsFileName = configManager.modern ? 'stats.modern.json' : 'stats.json';

  config.plugin('stats-plugin').use(StatsWriterPlugin, [
    {
      filename: statsFileName,
      stats: DEFAULT_STATS_OPTIONS,
      fields: DEFAULT_STATS_FIELDS,
    },
  ]);

  config
    .batch(js(configManager))
    .batch(ts(configManager))
    .batch(less(configManager))
    .batch(css(configManager))
    .batch(nodeClient(configManager));

  config.batch(postcssAssets(configManager));
};
