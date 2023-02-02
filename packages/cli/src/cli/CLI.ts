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

  runTask = (name: string, params: any) => {
    const task = this.tasks.find((item) => item.name === name);

    if (!task) {
      throw new Error(`Task ${name} not found`);
    }

    return task.run(params);
  };

  runCommand = (name: string, params: any) => {
    const command = this.commands.find((item) => item.name === name);

    if (!command) {
      throw new Error(`Command ${name} not found`);
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

  async run(argv: any) {
    return this.createCommandLineUI(argv);
  }

  protected createCommandLineUI(argv: any): Promise<CommandResult> {
    return new Promise((resolve) => {
      commander(this.commands, resolve)(argv);
    });
  }
}
