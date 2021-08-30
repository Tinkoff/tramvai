import { CLICommand } from '../../models/command';
import { checkApplication } from '../../validators/commands/checkBuild';
import { checkConfigExists } from '../../validators/commands/checkConfigExists';
import { checkDependencies } from '../../validators/commands/checkDependencies';
import type { StartCommand as StartCommandType } from '../../api/start';

export type Params = Parameters<StartCommandType>[0] & {
  target: string;
};

export class StartCommand extends CLICommand<Params> {
  name = 'start';

  description =
    'Команда для запуска в режиме разработки платформенных сущностей - приложений, модулей, библиотек';

  command = 'start <target>';

  options = [
    {
      name: '-p, --port',
      value: '[port]',
      description: 'port to run server',
    },
    {
      name: '-h, --host',
      value: '[host]',
      description: 'host to run server',
    },
    {
      name: '--sp, --staticPort',
      value: '[staticPort]',
      description: 'port to run static',
    },
    {
      name: '--sh, --staticHost',
      value: '[staticHost]',
      description: 'host to run static',
    },
    {
      name: '-d, --debug',
      value: '[debug]',
      description: 'start in debug mode (enable source map, server starting with --inspect)',
    },
    {
      name: '--trace',
      value: '[trace]',
      description:
        'start in trace mode (allow trace for warnings, server starts with --trace-deprecation)',
    },
    {
      name: '--profile',
      value: '[profile]',
      description: 'report statistic how much time execute loaders and plugins',
    },
    {
      name: '--modern',
      value: '[modern]',
      description: 'modern compilation code with es2015+',
    },
    {
      name: '--sm, --sourceMap',
      value: '[sourceMap]',
      description: 'enable source map generation',
    },
    {
      name: '-n, --noServerRebuild',
      value: '[noServerRebuild]',
      description: 'disable server rebuild on changes',
    },
    {
      name: '-l, --noClientRebuild',
      value: '[noClientRebuild]',
      description: 'disable client rebuild on changes',
    },
    {
      name: '-t, --buildType',
      value: '[type]',
      description: 'Тип сборки <client|server|all>',
      defaultValue: 'all',
    },
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
  ];

  alias = 's';

  validators = [checkConfigExists, checkApplication, checkDependencies];

  action(parameters) {
    // сделано через require, что бы стартовать код только тогда, когда он нужен
    return require('./start').default(this.context, parameters);
  }
}
