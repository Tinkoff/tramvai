import type ChainConfig from 'webpack-chain';
import { join } from 'path';
import chalk from 'chalk';
import { AnalyzePlugin } from '../types';
import { toWebpackConfig } from '../../../library/webpack/utils/toWebpackConfig';
import type { FileStatsOptions } from '../../../library/webpack/plugins/FileStats';
import { FileStatsPlugin } from '../../../library/webpack/plugins/FileStats';

export class WhyBundledAnalyzePlugin extends AnalyzePlugin {
  statsFileName = 'stats.json';

  statsFilePath: string;

  plugin = FileStatsPlugin;
  options: [FileStatsOptions] = [
    {
      filename: this.statsFileName,
      stats: {
        assets: true,
        publicPath: true,
        chunkModules: true,
        reasons: true,
        chunks: true,
        modulesSpace: Infinity,
      },
    },
  ];

  patchConfig = (config: ChainConfig) => {
    const outputPath = toWebpackConfig(config).output.path;
    this.statsFilePath = join(outputPath, this.statsFileName);

    return super.patchConfigInternal(config);
  };

  afterBuild = () => {
    console.log(chalk.yellow('Build was compiled with stats, use'));
    console.log(chalk.green(`npx whybundled ${this.statsFilePath}`));
    console.log(
      chalk.yellow('params are described on https://github.com/d4rkr00t/whybundled#usage')
    );

    return Promise.resolve();
  };
}
