import type { PackageManager } from '@tinkoff/package-manager-wrapper';
import type { Logger } from './logger';
import type { Command, CommandResult } from './command';
import type { Task, TaskResult } from './task';
import type { ConfigManager } from './config';
import type { Analytics } from './analytics';

export class Context {
  constructor(
    public config: ConfigManager,
    public logger: Logger,
    public analytics: Analytics,
    public cliRootDir: string,
    public cliPackageManager: PackageManager,
    public packageManager: PackageManager,
    public runTask: (name, params?) => Promise<TaskResult>,
    public runCommand: (name, params?) => Promise<CommandResult>,
    public getTasks: () => Task[],
    public getCommands: () => Command[]
  ) {}
}
