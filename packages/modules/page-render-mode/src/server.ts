import { declareModule } from '@tramvai/core';
import type { TramvaiRenderMode } from '@tramvai/tokens-render';
import { ForceCSRModule } from './ForceCSRModule';
import { sharedProviders } from './shared';
import { staticPagesProviders } from './staticPages';

export * from './tokens';

declare module '@tramvai/react' {
  export interface PageComponentOptions {
    renderMode?: TramvaiRenderMode;
  }
}

// @todo: перенести в @tramvai/module-render
export const PageRenderModeModule = declareModule({
  name: 'PageRenderModeModule',
  imports: [ForceCSRModule],
  providers: [...sharedProviders, ...staticPagesProviders],
});
