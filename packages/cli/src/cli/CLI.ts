import type { PackageManager } from '@tinkoff/package-manager-wrapper';
import { commander } from '../ui/commander';
import { Context } from '../models/context';
import type { Command, CommandMap, CommandResult } from '../models/command';
import type { Logger } from '../models/logger';
import type { Task, TaskMap } from '../models/task';
import type { ConfigManager } from '../models/config';
import type { Analytics } from '../models/analytics';

export class CLI {
  context: Context;

  tasks: Task[];

  commands: Command[];

  runTask = (name, params) => {
    const task = this.tasks.find((item) => item.name === name);

    if (!task) {
      console.error('Не найдена задача: ', name, params);
    }

    return task.run(params);
  };

  runCommand = (name, params) => {
    const command = this.commands.find((item) => item.name === name);

    if (!command) {
      console.error('Не найдена команда: ', name, params);
    }

    return command.run(params);
  };

  getTasks = () => {
    return this.tasks;
  };

  getCommands = () => {
    return this.commands;
  };

  constructor(
    commandsMap: CommandMap,
    tasksMap: TaskMap,
    logger: Logger,
    config: ConfigManager,
    analytics: Analytics,
    cliRootDir: string,
    cliPackageManager: PackageManager,
    packageManager: PackageManager
  ) {
    this.context = new Context(
      config,
      logger,
      analytics,
      cliRootDir,
      cliPackageManager,
      packageManager,
      this.runTask,
      this.runCommand,
      this.getTasks,
      this.getCommands
    );

    this.tasks = tasksMap.map((TaskItem) => new TaskItem(this.context));
    this.commands = commandsMap.map((CommandItem) => new CommandItem(this.context));
  }

  async run(argv) {
    return this.createCommandLineUI(argv);
  }

  protected createCommandLineUI(argv): Promise<CommandResult> {
    return new Promise((resolve) => {
      commander(this.commands, resolve)(argv);
    });
  }
}
