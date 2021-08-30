import webpack from 'webpack';
import rimraf from 'rimraf';
import type { ConfigManager } from '../config/configManager';
import { npmRequire } from './npmRequire';
import type { Context } from '../models/context';

export default (configManager: ConfigManager, config, context: Context) => {
  rimraf.sync(`${configManager.getBuildPath()}/*.*`, {});

  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (resolve, reject) => {
    if (configManager.build?.configurations?.imageOptimization?.enabled) {
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
