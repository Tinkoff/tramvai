import { Module, provide } from '@tramvai/core';
import { ROUTER_TOKEN } from '@tramvai/tokens-router';
import { EXTEND_RENDER } from '@tramvai/tokens-render';
import { CHILD_APP_INTERNAL_ROOT_STATE_ALLOWED_STORE_TOKEN } from '@tramvai/tokens-child-app';
import { provideRouter } from './tokens/common/render';
import { RouterStore } from '../stores/RouterStore';

@Module({
  providers: [
    provide({
      provide: EXTEND_RENDER,
      multi: true,
      useFactory: provideRouter,
      deps: {
        router: ROUTER_TOKEN,
      },
    }),
    {
      provide: CHILD_APP_INTERNAL_ROOT_STATE_ALLOWED_STORE_TOKEN,
      multi: true,
      useValue: RouterStore,
    },
  ],
})
export class RouterChildAppModule {}
