import { CLICommand } from '../../models/command';
import { checkApplication } from '../../validators/commands/checkBuild';

class LintCommand extends CLICommand {
  name = 'lint';

  description = 'Команда для запуска линтинга';

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
