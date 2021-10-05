import type { Context } from './context';

export type CommandConstructor = new (context: Context) => CLICommand;

export type CommandMap = CommandConstructor[];

export interface CommandResult {
  status: string;
  message?: string;
}

export interface Option {
  readonly name: string;
  readonly value?: string;
  readonly description: string;
  readonly defaultValue?: any;
  readonly transformer?: (...arg) => any;
}

type validator<TParams> = (
  context: Context,
  parameters: TParams
) => Promise<{ name: string; status: string; message?: string }>;

export abstract class Command<TParams = any> {
  readonly validators?: validator<TParams>[];

  abstract readonly name: string;

  abstract readonly description: string;

  abstract readonly command: string;

  abstract readonly options: Option[];

  abstract readonly alias: string;

  abstract run(parameters: TParams): Promise<CommandResult>;

  help?(): string[];

  protected abstract action(parameters: TParams): Promise<CommandResult>;

  protected abstract analyticEventLabel?(parameters: TParams): string;

  protected abstract analyticCommandUsageLabel?(parameters: TParams): string;
}

export abstract class CLICommand<
  TParams extends { target?: string } = any
> extends Command<TParams> {
  context: Context;

  constructor(context: Context) {
    super();

    this.context = context;
  }

  async run(parameters: TParams) {
    this.context.logger.event({
      type: 'info',
      event: `RUN:COMMAND:${this.name}`,
      message: JSON.stringify(parameters),
    });

    await this.validator(parameters);

    const trackAfter = this.context.analytics.trackAfter({
      name: this.name,
      parameters: this.analyticEventLabel(parameters),
      label: this.analyticCommandUsageLabel(parameters),
      category: 'command',
    });

    return trackAfter(this.action(parameters));
  }

  protected async validator(parameters: TParams): Promise<void> {
    if (!this.validators) {
      return;
    }

    const result = await Promise.all(this.validators.map((fn) => fn(this.context, parameters)));

    result.forEach((item) => {
      if (item.message) {
        this.context.logger.event({
          type: item.status === 'warning' || item.status === 'error' ? item.status : 'info',
          event: 'COMMAND:VALIDATE:MESSAGE',
          message: item.message,
        });

        if (item.status === 'error') {
          throw new Error('Validation failed, see errors above');
        }
      }
    });
  }

  protected analyticCommandUsageLabel({ target }: TParams) {
    return target;
  }

  protected analyticEventLabel(parameters: TParams) {
    return JSON.stringify(parameters);
  }
}
