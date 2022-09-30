import { Module } from '@tramvai/core';
import type { TramvaiRenderMode } from '@tramvai/tokens-render';
import { sharedProviders } from './shared';

export * from './tokens';

declare module '@tramvai/react' {
  export interface PageComponentOptions {
    renderMode?: TramvaiRenderMode;
  }
}

@Module({
  providers: [...sharedProviders],
})
export class PageRenderModeModule {}
