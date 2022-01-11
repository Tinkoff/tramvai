import chalk from 'chalk';
import { AnalyzePlugin } from './pluginBase';
import type { FileStatsOptions } from '../../../library/webpack/plugins/FileStats';
import { FileStatsPlugin } from '../../../library/webpack/plugins/FileStats';

export class StatoscopeAnalyzePlugin extends AnalyzePlugin {
  statsFileName = 'stats-all.json';

  requireDeps = [];

  statsFilePath: string;

  options: [FileStatsOptions] = [
    {
      filename: this.statsFileName,
      stats: {
        hash: true, // add compilation hash
        entrypoints: true, // add entrypoints stats
        chunks: true, // add chunks stats
        chunkModules: true, // add modules stats
        reasons: true, // add modules reasons stats

        assets: true, // add assets stats
        chunkOrigins: true, // add chunks origins stats (to find out which modules require a chunk)
        version: true, // add webpack version
        builtAt: true, // add build at time
        timings: true, // add build at time
        performance: true, // add info about oversized assets
        source: true, // add module sources (uses to find modules duplicates)
      },
    },
  ];

  plugin = FileStatsPlugin;

  afterBuild = () => {
    console.log(
      chalk.yellow(
        `Приложение собралось и корне проекта доступен файл со всей информацией по приложению в файле ${this.statsFileName}`
      )
    );
    console.log(
      chalk.green(
        `Далее необходимо зайти на страницу https://statoscope.tech/ и  drag-on-drop перенести файл из клиентских ассетов ${this.statsFileName}`
      )
    );

    return Promise.resolve();
  };
}
