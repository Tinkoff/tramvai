import { createWriteStream } from 'fs';
import { join as pathJoin } from 'path';
import type webpack from 'webpack';
import type { Compiler, WebpackOptionsNormalized } from 'webpack';
import { Compilation } from 'webpack';
import { stringifyStream } from '@discoveryjs/json-ext';

const PLUGIN_NAME = 'FileStatsPlugin';

export interface FileStatsOptions {
  filename: string;
  stats: Exclude<WebpackOptionsNormalized['stats'], boolean>;
}

/**
 * Special version to output webpack stats with handling big stats files by
 * using streaming json stringify
 *
 * Should be used only for analyze command
 */
export class FileStatsPlugin implements webpack.WebpackPluginInstance {
  protected options: FileStatsOptions;

  constructor(options: FileStatsOptions) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tapPromise(PLUGIN_NAME, (compilation) => {
      const { outputPath } = compiler;
      const filePath = pathJoin(outputPath, this.options.filename);
      const stats = compilation.getStats().toJson(this.options.stats);
      return new Promise((resolve, reject) => {
        stringifyStream(stats, null, 2)
          .on('error', reject)
          .pipe(createWriteStream(filePath))
          .on('error', reject)
          .on('close', () => {
            resolve();
          });
      });
    });
  }
}
