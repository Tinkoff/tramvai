import omit from '@tinkoff/utils/object/omit';
import prettyoutput from 'prettyoutput';
import chalk from 'chalk';
import type { ConfigManager } from './configManager';
import { box } from '../utils/formatting';

export const showConfig = (configManager: ConfigManager<any, any>) => {
  const configStr = prettyoutput(omit(['options'], configManager), {
    hideUndefined: true,
    maxDepth: Infinity,
  });

  process.stdout.write(
    box(
      [
        'Конфиг с которым был запущен @tramvai/cli',
        '',
        `${chalk.bold.blue(`▸ Type`)}        ${configManager.type}`,
        `${chalk.bold.blue(`▸ BuildType`)}   ${configManager.buildType}`,
      ],
      [configStr],
      {
        borderColor: 'green',
      }
    )
  );
};
