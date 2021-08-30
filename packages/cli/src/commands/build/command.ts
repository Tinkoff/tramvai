import { CLICommand } from '../../models/command';
import { checkApplication } from '../../validators/commands/checkBuild';
import { checkConfigExists } from '../../validators/commands/checkConfigExists';
import { checkDependencies } from '../../validators/commands/checkDependencies';
import type { BuildCommand as BuildCommandType } from '../../api/build';

export type Params = Parameters<BuildCommandType>[0] & {
  target: string;
};

class BuildCommand extends CLICommand<Params> {
  name = 'build';

  description = 'Команда сборки платформенных сущностей - приложений, модулей, библиотек';

  command = 'build <target>';

  options = [
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
      name: '--disableProdOptimization',
      value: '[disableProdOptimization]',
      description:
        'Отключает выполнение оптимизаций размеров бандла для прода (минификация и т.п.)',
    },
    {
      name: '--showConfig',
      value: '[showConfig]',
      description: 'Показать конфиг с которым был запущен cli',
    },
    {
      name: '--watch',
      value: '[watch]',
      description: 'Watch режим сборки для библиотек',
    },
  ];

  alias = 'b';

  validators = [checkConfigExists, checkApplication, checkDependencies];

  action(parameters: Params) {
    // сделано через require, что бы стартовать код только тогда, когда он нужен
    return require('./build').default(this.context, parameters);
  }
}

export default BuildCommand;
