import type { Provider, Container } from '@tinkoff/dippy';
import { DI_TOKEN } from '@tinkoff/dippy';
import type { Command } from '../typings/commands';
import { COMMAND_EXECUTION_TOKEN } from '../di/tokens';

export const createCommand = (command: {
  name: string;
  command: (di: Container) => Promise<any>;
  providers?: Provider[];
}): Command => {
  return {
    name: command.name,
    providers: [
      {
        provide: COMMAND_EXECUTION_TOKEN,
        useFactory: ({ di }: { di: typeof DI_TOKEN }) => {
          return command.command(di);
        },
        deps: {
          di: DI_TOKEN,
        },
      },
      ...(command.providers ?? []),
    ],
  };
};
