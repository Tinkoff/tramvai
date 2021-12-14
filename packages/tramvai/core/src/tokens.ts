import type { Container, Provider } from '@tinkoff/dippy';
import { createToken } from '@tinkoff/dippy';
import type { Command } from './command/command.h';
import type { Action } from './types/action';

export { DI_TOKEN, IS_DI_CHILD_CONTAINER_TOKEN } from '@tinkoff/dippy';

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

export type CommandLineDescription = Record<string, Command[]>;

export type CommandLines = {
  server: CommandLineDescription;
  client: CommandLineDescription;
};

export const COMMAND_LINE_RUNNER_TOKEN = createToken<CommandLine>('commandLineRunner');
export const COMMAND_LINES_TOKEN = createToken<CommandLines>('commandLines');

const multiOptions = { multi: true };
export const commandLineListTokens = {
  // Блок: Создание
  init: createToken<Command>('init', multiOptions),
  listen: createToken<Command>('listen', multiOptions),

  // Блок: Обработка клиентов
  customerStart: createToken<Command>('customer_start', multiOptions), // Инициализация клиента
  resolveUserDeps: createToken<Command>('resolve_user_deps', multiOptions), // Получение данных о клиенте
  resolvePageDeps: createToken<Command>('resolve_page_deps', multiOptions), // Получение данных необходимых для роута
  generatePage: createToken<Command>('generate_page', multiOptions), // Генерация html для страницы
  clear: createToken<Command>('clear', multiOptions), // Очистка данных

  // Блок: Переходы на клиенте
  spaTransition: createToken<Command>('spa_transition', multiOptions),

  // Блок: Закрытие сервера
  close: createToken<Command>('close', multiOptions),
};
