import type { Provider } from '@tinkoff/dippy';
import { createToken } from '@tinkoff/dippy';
import type { Command } from '../../typings/commands';

export interface CommandRunner {
  run(commandName: string, parameters: Record<string, any>, providers?: Provider[]): Promise<any>;
}

export const COMMAND_NAME_TOKEN = createToken<string>('command name');

export const COMMAND_EXECUTION_TOKEN = createToken<Promise<any>>('command execution');
export const COMMAND_PARAMETERS_TOKEN = createToken<Record<string, any>>('command parameters');

export const COMMAND_MAP_TOKEN = createToken<{
  [name: string]: () => Promise<{ default: Command }>;
}>('command map');

export const COMMAND_RUNNER_TOKEN = createToken<CommandRunner>('command runner');
