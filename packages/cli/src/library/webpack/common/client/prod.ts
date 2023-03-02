import once from '@tinkoff/utils/function/once';
import type Config from 'webpack-chain';
import chalk from 'chalk';
import { DuplicatesPlugin } from 'inspectpack/plugin';
import type { DedupePluginOptions } from '@tinkoff/webpack-dedupe-plugin';
import { DedupePlugin } from '@tinkoff/webpack-dedupe-plugin';
import type { ConfigManager } from '../../../../config/configManager';
import type { CliConfigEntry } from '../../../../typings/configEntry/cli';

const onDedupeInfo = once<DedupePluginOptions['onDedupeInfo']>((logInfo) => {
  if (logInfo.size > 0) {
    console.warn(`${chalk.blue('Duplicates were found and merged during build.')}
You may want to additionally optimize your dependencies tree to bypass possible issues with duplicates.
For further details refer to doc - https://tramvai.dev/docs/mistakes/duplicate-dependencies
    `);
  }
});

export default (configManager: ConfigManager<CliConfigEntry>) => (config: Config) => {
  config.mode('production');

  config.plugin('define').tap((args) => [
    {
      ...args[0],
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  ]);

  if (configManager.dedupe.enabled) {
    config.plugin('dedupe-plugin').use(DedupePlugin, [
      {
        strategy: configManager.dedupe.strategy,
        ignorePackages: configManager.dedupe.ignore?.map((ignore) => new RegExp(`^${ignore}`)),
        showLogs: !configManager.modern,
        onDedupeInfo,
      } as DedupePluginOptions,
    ]);
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
