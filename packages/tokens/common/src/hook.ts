import { createToken } from '@tinkoff/dippy';

/**
 * @description
 * [Hooks documentation](https://tramvai.dev/docs/references/libs/hooks)
 */
export const HOOK_TOKEN = createToken<Hooks>('hooks');

type Hook<TPayload> = (context: any, payload?: TPayload, options?: any) => TPayload;

export interface Hooks {
  /**
   * Register hooks
   */
  registerHooks<TPayload>(name: string, list: Hook<TPayload>[] | Hook<TPayload>): void;

  /**
   * Run sync hook
   */
  runHooks<TPayload>(
    name: string,
    context: any,
    payload?: TPayload,
    options?: any
  ): TPayload | undefined;

  /**
   * Run async hooksЗапуск ассихронных хуков
   */
  runAsyncHooks<TPayload>(name: string, context: any, payload: TPayload, options?: any): TPayload;

  /**
   * Run promise hooks
   */
  runPromiseHooks(
    name: string,
    context: any,
    options?: any
  ): <TPayload>(payload: TPayload) => Promise<TPayload> | Promise<never>;
}
