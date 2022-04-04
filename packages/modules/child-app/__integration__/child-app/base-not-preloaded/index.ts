import { createChildApp } from '@tramvai/child-app-core';
import { BaseCmp } from './component';

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'base-not-preloaded',
  render: BaseCmp,
});
