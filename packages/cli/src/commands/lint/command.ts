import { CLICommand } from '../../models/command';
import { checkApplication } from '../../validators/commands/checkBuild';

class LintCommand extends CLICommand {
  name = 'lint';

  description = 'Command to run lint';

  command = 'lint <target>';

  options = [];

  alias = 'l';

  validators = [checkApplication];

  action() {
    return Promise.resolve({
      status: 'ok',
    });
  }
}

export default LintCommand;
