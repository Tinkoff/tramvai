import { CLICommand } from '../../models/command';
import { checkApplication } from '../../validators/commands/checkBuild';

export type Params = {
  target: string;
  showConfig?: boolean;
};

export class StaticCommand extends CLICommand<Params> {
  name = 'static';

  description = 'Команда для сборки приложения в статичную версию';

  command = 'static <target>';

  options = [
    {
      name: '--showConfig',
      value: '[showConfig]',
      description: 'Показать конфиг с которым был запущен cli',
    },
  ];

  alias = 'st';

  validators = [checkApplication];

  action(parameters: Params) {
    // сделано через require, что бы стартовать код только тогда, когда он нужен
    return require('./static').default(this.context, parameters);
  }
}
