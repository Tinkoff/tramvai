import { CLICommand } from '../../models/command';
import { checkApplication } from '../../validators/commands/checkBuild';
import { checkConfigExists } from '../../validators/commands/checkConfigExists';
import { checkDependencies } from '../../validators/commands/checkDependencies';
import { runMigrationsAndCheckVersions } from '../../validators/commands/runMigrationsAndCheckVersions';
import type { Params as StartParams } from '../start/command';

export type Params = StartParams & {
  times?: number;
};

export class BenchmarkCommand extends CLICommand<Params> {
  name = 'benchmark';

  description = 'Команда для запуска бенчмарка работы @tramvai/cli';

  command = 'benchmark <command> <target>';

  options = [
    {
      name: '--rs, --resolveSymlinks',
      value: '[resolveSymlinks]',
      transformer: (value) => value !== 'false',
      description:
        'Передает значение в `resolve.symlinks` в webpack (https://webpack.js.org/configuration/resolve/#resolve-symlinks)`',
    },
    {
      name: '--showConfig',
      value: '[showConfig]',
      description: 'Показать конфиг с которым был запущен cli',
    },
    {
      name: '--onlyBundles',
      value: '[onlyBundles]',
      transformer: (value: string) => value.split(','),
      description:
        'Указать имена бандлов которые нужно собирать, другие бандлы собираться не будут и их запрос будет падать с ошибкой',
    },
    {
      name: '--times',
      value: '[times]',
      description: 'Количество прогонов для бенчмарка',
    },
  ];

  alias = 'bench';

  validators = [
    checkConfigExists,
    checkApplication,
    runMigrationsAndCheckVersions,
    checkDependencies,
  ];

  action(parameters) {
    // used require for lazy code execution
    return require('./benchmark').default(this.context, parameters);
  }
}
