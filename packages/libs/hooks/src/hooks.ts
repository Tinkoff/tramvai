import uniq from '@tinkoff/utils/array/uniq';

export type Hook<TPayload = any> = (context: any, payload?: TPayload, options?: any) => TPayload;

export class Hooks {
  hooks: Record<string, Hook[]>;

  constructor() {
    this.hooks = Object.create(null);
  }

  /**
   * Регистрация хуков
   */
  registerHooks<TPayload = any>(name: string, list: Array<Hook<TPayload>> | Hook<TPayload>) {
    if (!this.hooks[name]) {
      this.hooks[name] = [];
    }

    this.hooks[name] = uniq(this.hooks[name].concat(list));
  }

  /**
   * Запуск синхронных хуков, payload проходит через все хуки и будет результатом выполнения
   */
  // eslint-disable-next-line max-params
  runHooks<TPayload>(name: string, context: any, payload?: TPayload, options?: any) {
    const plugins = this.hooks[name];

    if (!plugins) {
      return payload;
    }

    let current = payload;

    for (let i = 0; i < plugins.length; i++) {
      current = plugins[i](context, current, options);
    }

    return current;
  }

  /**
   * Запуск ассихронных хуков
   */
  runAsyncHooks<TPayload>(name: string, context: any, payload: TPayload, options?: any) {
    const plugins = this.hooks[name];

    if (!plugins) {
      return payload;
    }

    for (let i = 0; i < plugins.length; i++) {
      const plugin = plugins[i];

      setTimeout(() => {
        plugin(context, payload, options);
      });
    }

    return payload;
  }

  /**
   * Запуск проммис хуков
   */
  runPromiseHooks(name: string, context: any, options?: any) {
    const plugins = this.hooks[name];

    return <TPayload>(payload: TPayload) => {
      if (!plugins) {
        return Promise.resolve(payload);
      }

      let currentId = 0;

      return Promise.resolve(payload).then(function resolver(data): TPayload | Promise<TPayload> {
        // eslint-disable-next-line no-plusplus
        const plugin = plugins[currentId++];

        if (!plugin) {
          return data;
        }

        // eslint-disable-next-line promise/no-nesting
        return Promise.resolve(plugin(context, data, options)).then(resolver);
      });
    };
  }
}
