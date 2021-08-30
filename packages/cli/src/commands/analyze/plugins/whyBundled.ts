import type ChainConfig from 'webpack-chain';
import { join } from 'path';
import chalk from 'chalk';
import { AnalyzePlugin } from './pluginBase';
import { toWebpackConfig } from '../../../library/webpack/utils/toWebpackConfig';

export class WhyBundledAnalyzePlugin extends AnalyzePlugin {
  statsFileName = 'stats.json';

  statsFilePath: string;

  options = [];

  patchConfig = (config: ChainConfig) => {
    const outputPath = toWebpackConfig(config).output.path;
    this.statsFilePath = join(outputPath, this.statsFileName);
    this.options = [
      {
        filename: this.statsFileName,
        fields: null,
        stats: {
          assets: true,
          publicPath: true,
          chunkModules: true,
          reasons: true,
          chunks: true,
          maxModules: Infinity,
        },
      },
    ];

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

  get plugin() {
    return require('webpack-stats-plugin').StatsWriterPlugin;
  }
}
