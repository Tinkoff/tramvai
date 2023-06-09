import path from 'path';
import fs from 'fs';
import type Config from 'webpack-chain';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

import type { ConfigManager } from '../../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../../typings/configEntry/application';
import { safeRequireResolve } from '../../../../utils/safeRequire';

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
import { configToEnv } from '../../blocks/configToEnv';
import { DEFAULT_STATS_OPTIONS, DEFAULT_STATS_FIELDS } from '../../constants/stats';
import { pwaBlock } from '../../blocks/pwa/client';
import type { ModuleFederationFixRangeOptions } from '../../plugins/ModuleFederationFixRange';
import { ModuleFederationFixRange } from '../../plugins/ModuleFederationFixRange';

export default (configManager: ConfigManager<ApplicationConfigEntry>) => (config: Config) => {
  const { polyfill, fileSystemPages, shared } = configManager;

  const portal = path.resolve(configManager.rootDir, `packages/${process.env.APP_ID}/portal.js`);
  const polyfillPath = path.resolve(configManager.rootDir, polyfill ?? 'src/polyfill');
  const portalExists = fs.existsSync(portal);
  const polyfillExists = !!safeRequireResolve(polyfillPath, typeof polyfill === 'undefined');

  config
    .name('client')
    .target(configManager.modern ? 'web' : ['web', 'es5'])
    .batch(common(configManager))
    .batch(commonApplication(configManager))
    .batch(configToEnv(configManager))
    .batch(files(configManager))
    .batch(js(configManager))
    .batch(ts(configManager))
    .batch(less(configManager))
    .batch(css(configManager))
    .batch(nodeClient(configManager))
    .batch(postcssAssets(configManager))
    .batch(pwaBlock(configManager))
    .when(fileSystemPages.enabled, (cfg) => cfg.batch(pagesResolve(configManager)));

  config
    .entry('platform')
    .add(path.resolve(configManager.rootDir, `${configManager.root}/index`))
    .end()
    .when(portalExists, (cfg) => cfg.entry('portal').add(portal))
    .when(polyfillExists, (cfg) => cfg.entry('polyfill').add(polyfillPath));

  config.plugin('module-federation-validate-duplicates').use(ModuleFederationFixRange, [
    {
      flexibleTramvaiVersions: shared.flexibleTramvaiVersions,
    } as ModuleFederationFixRangeOptions,
  ]);

  config
    .plugin('stats-plugin')
    .use(StatsWriterPlugin, [
      {
        filename: configManager.modern ? 'stats.modern.json' : 'stats.json',
        stats: DEFAULT_STATS_OPTIONS,
        fields: DEFAULT_STATS_FIELDS,
      },
    ])
    .end()
    .plugin('define')
    .tap((args) => [
      {
        ...args[0],
        'process.env.BROWSER': true,
        'process.env.SERVER': false,
      },
    ]);

  return config;
};
