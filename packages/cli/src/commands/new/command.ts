import { CLICommand } from '../../models/command';
import type { Params } from './typings';

class NewCommand extends CLICommand<Params> {
  name = 'new';

  description = 'Command for generating a new application';

  command = 'new <name>';

  options = [
    {
      name: '--type',
      value: '[type]',
      description: 'Type of the new generated project <app|child-app>',
    },
    {
      name: '--template',
      value: '[template]',
      description: 'Template for the project <monorepo|multirepo>',
    },
    {
      name: '--packageManager',
      value: '[packageManager]',
      description: 'Package manager for the project <npm|yarn>',
    },
    {
      name: '--testingFramework',
      value: '[testingFramework]',
      description: 'Test framework for the project <none|jest>',
    },
  ];

  alias = 'n';

  validators = [];

  action(parameters: Params) {
    // used require for lazy code execution
    return require('./new').default(this.context, parameters);
  }
}

export default NewCommand;
