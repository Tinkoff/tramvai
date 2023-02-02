import webpack from 'webpack';
import rimraf from 'rimraf';
import type { ConfigManager } from '../config/configManager';
import { npmRequire } from './npmRequire';
import type { Context } from '../models/context';
import type { CliConfigEntry } from '../typings/configEntry/cli';

export default (configManager: ConfigManager<CliConfigEntry>, config, context: Context) => {
  rimraf.sync(`${configManager.buildPath}/*.*`, {});

  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (resolve, reject) => {
    if (configManager.imageOptimization?.enabled) {
      await npmRequire({
        cliRootDir: context.cliRootDir,
        packageManager: context.cliPackageManager,
        packageName: 'image-webpack-loader',
        description: 'Устанавливаем зависимости для опции imageOptimization',
      });
    }

    webpack(config, (err, stats) => {
      if (err || stats.hasErrors()) {
        return reject(
          err ||
            new Error(
              stats
                .toJson()
                .errors.map((error: any) => error.message ?? error)
                .join('\n')
            )
        );
      }

      return resolve();
    });
  });
};
