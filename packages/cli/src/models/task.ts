import type { CommonOptions } from 'execa';
import execa from 'execa';
import type { Context } from './context';

export type TaskConstructor = new (context: Context) => Task;

export type TaskMap = TaskConstructor[];

export interface TaskResult {
  status: string;
  code: number;
  stdout: string;
  stderr: string;
}

export abstract class Task {
  readonly options: CommonOptions<string> = { stdio: 'inherit' as const };

  context: Context;

  constructor(context) {
    this.context = context;
  }

  abstract readonly name: string;

  abstract readonly description: string;

  abstract readonly command: string;

  abstract readonly arguments: string[];

  async run(
    parameters: { arguments?: string[]; options?: Record<string, any> } = {}
  ): Promise<TaskResult> {
    this.context.logger.event({
      type: 'debug',
      event: `RUN:TASK:${this.name}`,
      message: JSON.stringify(parameters),
    });
    const args = [...this.arguments, ...(parameters.arguments || [])];
    const options = { ...this.options, ...parameters.options };
    const trackAfter = this.context.analytics.trackAfter({
      name: this.name,
      category: 'task',
      parameters: args,
      label: this.analyticTaskUsageLabel(args),
    });

    return trackAfter(this.execute(this.command, args, options))
      .then((result) => ({
        status: 'ok',
        code: result.exitCode,
        stdout: result.stdout,
        stderr: result.stderr,
      }))
      .catch((error) => ({
        status: 'fail',
        code: error.code,
        stdout: error.stdout,
        stderr: error.stderr,
      }));
  }

  /**
   *
   * @param command - команда для выполнения. Пример 'npm'
   * @param args - аргументы выполнения. Пример ['run', install']
   * @param options - опции выполнения. Пример { env: { 'NODE_ENV': 'production' } }
   */
  protected execute(command: string, args?: string[], options?: Record<string, any>) {
    return execa(command, args, options);
  }

  private analyticTaskUsageLabel(args: string[]) {
    return args && args[0];
  }
}
