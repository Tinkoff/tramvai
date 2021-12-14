import { Module, provide } from '@tramvai/core';
import { ROUTER_TOKEN } from '@tramvai/tokens-router';
import { EXTEND_RENDER } from '@tramvai/tokens-render';
import { provideRouter } from './tokens/common/render';

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
  ],
})
export class RouterChildAppModule {}
