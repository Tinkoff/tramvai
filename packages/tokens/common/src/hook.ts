import { createToken } from '@tinkoff/dippy';

/**
 * @description
 * В некоторых случаях нам нужно встроиться в функционал и это позволяют сделать хуки, [документация](https://tramvai.dev/docs/references/libs/hooks)
 */
export const HOOK_TOKEN = createToken<Hooks>('hooks');

type Hook<TPayload> = (context: any, payload?: TPayload, options?: any) => TPayload;

export interface Hooks {
  /**
   * Регистрация хуков
   */
  registerHooks<TPayload>(name: string, list: Hook<TPayload>[] | Hook<TPayload>): void;

  /**
   * Запуск синхронных хуков, payload проходит через все хуки и будет результатом выполнения
   */
  runHooks<TPayload>(name: string, context: any, payload?: TPayload, options?: any): TPayload;

  /**
   * Запуск ассихронных хуков
   */
  runAsyncHooks<TPayload>(name: string, context: any, payload: TPayload, options?: any): TPayload;

  /**
   * Запуск проммис хуков
   */
  runPromiseHooks(
    name: string,
    context: any,
    options?: any
  ): <TPayload>(payload: TPayload) => Promise<TPayload> | Promise<never>;
}
