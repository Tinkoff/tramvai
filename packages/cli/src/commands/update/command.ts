import { CLICommand } from '../../models/command';
import { checkVersion } from './checkVersionValidator';
import type { Params } from './update';

class UpdateCommand extends CLICommand {
  name = 'update';

  description = `All tramvai packages update command
  [to] - target version <latest|X.X.X|^X.X.X> (default: latest)`;

  command = `update <to>`;

  options = [];

  alias = 'u';

  validators = [checkVersion];

  async action(parameters: Params) {
    // used require for lazy code execution
    return require('./update').default(this.context, parameters);
  }
}

export default UpdateCommand;
