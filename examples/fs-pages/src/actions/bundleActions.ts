import { createAction } from '@tramvai/core';

export const bundleServerOnlyAction = createAction({
  name: 'bundle-server-action',
  fn: (context, payload) => {
    console.log('Выполняется один раз на сервере');
  },
  conditions: {
    onlyServer: true,
  },
});

export const bundleClientOnlyAction = createAction({
  name: 'bundle-client-action',
  fn: (context, payload) => {
    console.log('Выполняется один раз на клиенте');
  },
  conditions: {
    onlyBrowser: true,
  },
});
