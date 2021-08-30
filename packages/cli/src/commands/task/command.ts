import { CLICommand } from '../../models/command';

class LintCommand extends CLICommand {
  name = 'task';

  description = 'Запуск команд';

  command = 'task <name> [options]';

  options = [];

  alias = 't';

  help() {
    const result = ['Список зарегистрированных команд'];

    this.context.getTasks().forEach((task) => {
      result.push(`Название: ${task.name}, Описание: ${task.description}`);
    });

    return result;
  }

  action(parameters) {
    return this.context.runTask(parameters.name);
  }
}

export default LintCommand;
