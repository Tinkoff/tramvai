import { CLICommand } from '../../models/command';
import { checkVersion } from './checkVersionValidator';
import type { Params } from './update';

class UpdateCommand extends CLICommand {
  name = 'update';

  description = 'Tramvai package update command';

  command = 'update';

  options = [
    {
      name: '-to, --to',
      value: '[to]',
      description: 'Версия <latest|X.X.X>',
      defaultValue: 'latest',
    },
  ];

  alias = 'u';

  validators = [checkVersion];

  async action(parameters: Params) {
    // сделано через require, что бы стартовать код только тогда, когда он нужен
    return require('./update').default(this.context, parameters);
  }
}

export default UpdateCommand;
