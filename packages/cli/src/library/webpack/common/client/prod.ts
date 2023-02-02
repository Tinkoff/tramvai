import type Config from 'webpack-chain';
import { DuplicatesPlugin } from 'inspectpack/plugin';
import { createDedupePlugin } from '@tinkoff/webpack-dedupe-plugin';
import type { ConfigManager } from '../../../../config/configManager';
import type { CliConfigEntry } from '../../../../typings/configEntry/cli';

export default (configManager: ConfigManager<CliConfigEntry>) => (config: Config) => {
  config.mode('production');

  config.plugin('define').tap((args) => [
    {
      ...args[0],
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  ]);

  if (configManager.dedupe.enabled) {
    config.plugin('dedupe-plugin').use(
      createDedupePlugin(
        configManager.dedupe.strategy,
        configManager.dedupe.ignore?.map((ignore) => new RegExp(`^${ignore}`))
      )
    );
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
