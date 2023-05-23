import { Module } from '@tramvai/core';
import { LAYOUT_OPTIONS } from '@tramvai/tokens-render';
import { Autoscroll } from './components/Autoscroll';

export * from './tokens';

export { Autoscroll };

@Module({
  providers: [
    {
      provide: LAYOUT_OPTIONS,
      useValue: {
        components: {
          autoscroll: Autoscroll,
        },
      },
      multi: true,
    },
  ],
})
export class AutoscrollModule {}
