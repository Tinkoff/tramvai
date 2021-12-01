import { createAction } from '@tramvai/core';

export const globalAction = createAction({
  name: 'global-action',
  fn: (context, payload) => {
    console.log('Выполняется на каждый переход на сервере и на клиенте');
  },
  conditions: {
    always: true,
  },
});
