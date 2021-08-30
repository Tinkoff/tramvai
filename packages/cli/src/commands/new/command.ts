import { CLICommand } from '../../models/command';
import type { Params } from './typings';

class NewCommand extends CLICommand<Params> {
  name = 'new';

  description = 'Команда для генерации нового приложения';

  command = 'new <name>';

  options = [
    {
      name: '--template',
      value: '[template]',
      description: 'Шаблон для проекта <monorepo|multirepo>',
    },
    {
      name: '--ci',
      value: '[ci]',
      description: 'Настройки CI для проекта <none|pfp-gitlab|common-gitlab>',
    },
    {
      name: '--packageManager',
      value: '[packageManager]',
      description: 'Менеджер пакетов для проекта <npm|yarn>',
    },
    {
      name: '--testingFramework',
      value: '[testingFramework]',
      description: 'Тестовый фреймворк для проекта <none|jest>',
    },
  ];

  alias = 'n';

  validators = [];

  action(parameters: Params) {
    // сделано через require, что бы стартовать код только тогда, когда он нужен
    return require('./new').default(this.context, parameters);
  }
}

export default NewCommand;
