import { createChildApp } from '@tramvai/child-app-core';
import { provide } from '@tramvai/core';
import { BaseCmp } from './component';
import { CHILD_APP_BASE_TOKEN } from './tokens';

// eslint-disable-next-line import/no-default-export
export default createChildApp({
  name: 'base',
  render: BaseCmp,
  providers: [
    provide({
      provide: CHILD_APP_BASE_TOKEN,
      useValue: "I'm little child app",
    }),
  ],
});
