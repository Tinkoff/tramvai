import type { BaseStore } from '../stores/BaseStore';

export const subscribe = <T>(store: BaseStore<T>, handler: () => void) => {
  // подписываемся на изменения
  store.on('change', handler);

  // вызываем сразу, чтобы заполнить начальное состояние
  handler();
};
