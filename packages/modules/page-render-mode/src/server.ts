import { Module } from '@tramvai/core';
import type { TramvaiRenderMode } from '@tramvai/tokens-render';
import { sharedProviders } from './shared';
import { staticPagesProviders } from './staticPages';

export * from './tokens';

declare module '@tramvai/react' {
  export interface PageComponentOptions {
    renderMode?: TramvaiRenderMode;
  }
}

@Module({
  providers: [...sharedProviders, ...staticPagesProviders],
})
export class PageRenderModeModule {}
