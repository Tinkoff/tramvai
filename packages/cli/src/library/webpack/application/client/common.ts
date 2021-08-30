import path from 'path';
import fs from 'fs';
import type Config from 'webpack-chain';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

import type { ConfigManager } from '../../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../../typings/configEntry/application';

import common from '../../common/main';
import files from '../../blocks/filesClient';
import ts from '../../blocks/ts';
import js from '../../blocks/js';
import less from '../../blocks/less';
import css from '../../blocks/css';
import postcssAssets from '../../blocks/postcssAssets';
import nodeClient from '../../blocks/nodeClient';

export default (configManager: ConfigManager<ApplicationConfigEntry>) => (config: Config) => {
  const { options: { polyfill = '', vendor = '' } = {} } = configManager.build;

  config.name('client');

  config.batch(common(configManager));
  config.batch(files(configManager));

  const portal = path.resolve(configManager.rootDir, `packages/${process.env.APP_ID}/portal.js`);

  config.target(configManager.modern ? 'web' : ['web', 'es5']);

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

  if (polyfill) {
    config.entry('polyfill').add(path.resolve(configManager.rootDir, polyfill));
  }

  if (vendor) {
    config.entry('vendor').add(path.resolve(configManager.rootDir, vendor));
    config
      .entry('platform')
      .clear()
      .add({
        import: path.resolve(configManager.rootDir, `${configManager.root}/index`),
        // указываем что platform зависит от vendor, чтобы пакеты не дублировались
        dependOn: 'vendor',
      });
  }

  const statsFileName = configManager.modern ? 'stats.modern.json' : 'stats.json';

  config.plugin('stats-plugin').use(StatsWriterPlugin, [
    {
      filename: statsFileName,
      stats: {
        all: false, // отключаем большинство ненужной информации

        publicPath: true,
        assets: true,
        outputPath: true, // выводит информацию о том в какой папке хранится билд на диске
        chunkGroups: true, // позволяет получить в stats поле namedChunkGroups которое потом используется в webpack-flush-chunks для получения чанков-зависимостей
        ids: true, // необходимо чтобы в chunksGroups были выставлены связи между модулями
      },
      fields: ['publicPath', 'outputPath', 'assetsByChunkName', 'namedChunkGroups'],
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
