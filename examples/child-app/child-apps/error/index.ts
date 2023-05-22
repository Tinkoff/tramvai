import { createChildApp } from '@tramvai/child-app-core';
import { CommonChildAppModule } from '@tramvai/module-common';
import { RouterChildAppModule } from '@tramvai/module-router';
import { ErrorCmp } from './component';

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'error',
  render: ErrorCmp,
  modules: [CommonChildAppModule, RouterChildAppModule],
});
