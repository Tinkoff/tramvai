import { createApp } from '@tramvai/core';
import { modules } from '../common';

// см. /papi/getSum.ts
createApp({
  name: 'server',
  modules: [...modules],
  bundles: {},
});
