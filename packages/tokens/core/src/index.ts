import type { Container, Provider, MultiTokenInterface } from '@tinkoff/dippy';
import { createToken } from '@tinkoff/dippy';
import type { Command } from './command';
import type { Action } from './action';

export * from './action';
export * from './command';
export * from './bundle';

export const BUNDLE_LIST_TOKEN = createToken('bundleList');
export const ACTIONS_LIST_TOKEN = createToken<Action[]>('actionsList');
export const MODULES_LIST_TOKEN = createToken('modulesList');
export const APP_INFO_TOKEN = createToken<{ appName: string; [key: string]: string }>('appInfo');

export interface CommandLine {
  lines: CommandLines;

  run(
    type: keyof CommandLines,
    status: keyof CommandLineDescription,
    providers?: Provider[],
    customDi?: Container
  ): Promise<Container>;
}

export type CommandLineDescription = Record<string, MultiTokenInterface<Command>[]>;

export type CommandLines = {
  server: CommandLineDescription;
  client: CommandLineDescription;
};

export const COMMAND_LINE_RUNNER_TOKEN = createToken<CommandLine>('commandLineRunner');
export const COMMAND_LINES_TOKEN = createToken<CommandLines>('commandLines');

const multiOptions = { multi: true } as const;
export const commandLineListTokens = {
  // Block: Initializing
  init: createToken<Command>('init', multiOptions),
  listen: createToken<Command>('listen', multiOptions),

  // Block: Request handling
  customerStart: createToken<Command>('customer_start', multiOptions), // Client initialization
  resolveUserDeps: createToken<Command>('resolve_user_deps', multiOptions), // Get the client data
  resolvePageDeps: createToken<Command>('resolve_page_deps', multiOptions), // Get the page data
  generatePage: createToken<Command>('generate_page', multiOptions), // Generate html for the page
  clear: createToken<Command>('clear', multiOptions), // Cleanup

  // Block: Client navigations
  spaTransition: createToken<Command>('spa_transition', multiOptions),
  afterSpaTransition: createToken<Command>('after_spa_transition', multiOptions),

  // Block: Server stop
  close: createToken<Command>('close', multiOptions),
};
