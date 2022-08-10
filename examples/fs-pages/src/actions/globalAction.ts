import { declareAction } from '@tramvai/core';

export const globalAction = declareAction({
  name: 'global-action',
  fn: () => {
    console.log('Выполняется на каждый переход на сервере и на клиенте');
  },
  conditions: {
    always: true,
  },
});
