import type { Provider } from '@tinkoff/dippy';
import { DI_TOKEN } from '@tinkoff/dippy';
import {
  COMMAND_RUNNER_TOKEN,
  COMMAND_MAP_TOKEN,
  COMMAND_EXECUTION_TOKEN,
  COMMAND_NAME_TOKEN,
  COMMAND_PARAMETERS_TOKEN,
} from '../tokens';
import { initChildContainer } from '../child';

type Interface = typeof COMMAND_RUNNER_TOKEN;

export class CommandRunner implements Interface {
  commands: typeof COMMAND_MAP_TOKEN;

  rootContainer: typeof DI_TOKEN;

  constructor({ commands, rootContainer }) {
    this.commands = commands;
    this.rootContainer = rootContainer;
  }

  async run(commandName: string, commandParameters: Record<string, any>) {
    const commandResolver = this.commands[commandName];

    if (!commandResolver) {
      throw new Error(`Command ${commandName} not found`);
    }

    const resolvedCommand = await commandResolver();
    const command = resolvedCommand.default;

    if (command.name !== commandName) {
      throw new Error(
        `Command name do not equal name passed to createCommand, expected ${commandName}, got ${command.name}`
      );
    }

    const childContainer = initChildContainer(this.rootContainer, [
      ...command.providers,
      {
        provide: COMMAND_NAME_TOKEN,
        useValue: commandName,
      },
      {
        provide: COMMAND_PARAMETERS_TOKEN,
        useValue: commandParameters,
      },
    ]);

    return childContainer.get(COMMAND_EXECUTION_TOKEN);
  }
}

export const commandsProviders: readonly Provider[] = [
  {
    provide: COMMAND_RUNNER_TOKEN,
    useClass: CommandRunner,
    deps: {
      commands: COMMAND_MAP_TOKEN,
      rootContainer: DI_TOKEN,
    },
  },
];
