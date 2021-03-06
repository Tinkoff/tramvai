import type Config from 'webpack-chain';
import { DuplicatesPlugin } from 'inspectpack/plugin';
import { createDedupePlugin } from '../../plugins/DedupePlugin';
import type { ConfigManager } from '../../../../config/configManager';

export default (configManager: ConfigManager) => (config: Config) => {
  config.mode('production');

  config.plugin('define').tap((args) => [
    {
      ...args[0],
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  ]);

  if (configManager.dedupe) {
    config
      .plugin('dedupe-plugin')
      .use(createDedupePlugin(configManager.dedupe, configManager.dedupeIgnore));
  } else {
    config.plugin('duplicates-plugin').use(DuplicatesPlugin, [
      {
        verbose: true,
        // используем console напрямую,
        // т.к. встроенный вывод DuplicatesPlugin отображается в терминале не полностью
        emitHandler: (report: string) => {
          console.warn(report);
        },
      },
    ]);
  }
};
