import { CLICommand } from '../../models/command';

class LintCommand extends CLICommand {
  name = 'task';

  description = 'Run task';

  command = 'task <name> [options]';

  options = [];

  alias = 't';

  help() {
    const result = ['List of the registered tasks'];

    this.context.getTasks().forEach((task) => {
      result.push(`Name: ${task.name}, Description: ${task.description}`);
    });

    return result;
  }

  action(parameters) {
    return this.context.runTask(parameters.name);
  }
}

export default LintCommand;
