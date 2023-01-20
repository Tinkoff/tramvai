import { createChildApp } from '@tramvai/child-app-core';
import { CommonChildAppModule } from '@tramvai/module-common';
import { ReactQueryModule } from '@tramvai/module-react-query';
import { Cmp } from './component';
import { query } from './query';

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'react-query',
  render: Cmp,
  modules: [CommonChildAppModule, ReactQueryModule],
  actions: [query.prefetchAction()],
});
