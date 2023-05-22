import { createChildApp } from '@tramvai/child-app-core';
import { RouterChildAppModule } from '@tramvai/module-router';
import { RouterCmp } from './component';

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'router',
  render: RouterCmp,
  modules: [RouterChildAppModule],
});
