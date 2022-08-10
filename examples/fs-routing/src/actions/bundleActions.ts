import { declareAction } from '@tramvai/core';

export const bundleServerOnlyAction = declareAction({
  name: 'bundle-server-action',
  fn: async () => {
    // Выполняется один раз на сервере
  },
  conditions: {
    onlyServer: true,
  },
});

export const bundleClientOnlyAction = declareAction({
  name: 'bundle-client-action',
  fn: () => {
    // Выполняется один раз на клиенте
  },
  conditions: {
    onlyBrowser: true,
  },
});
