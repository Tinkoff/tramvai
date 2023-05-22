import { createChildApp } from '@tramvai/child-app-core';
import { RouterChildAppModule } from '@tramvai/module-router';
import { HeaderCmp } from './component';

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'header',
  render: HeaderCmp,
  modules: [RouterChildAppModule],
});
