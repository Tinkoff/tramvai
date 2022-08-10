import { declareAction } from '@tramvai/core';

export const globalAction = declareAction({
  name: 'global-action',
  fn: () => {
    // Выполняется на каждый переход на сервере и на клиенте
  },
  conditions: {
    always: true,
  },
});
