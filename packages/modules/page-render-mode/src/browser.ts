import { declareModule } from '@tramvai/core';
import type { TramvaiRenderMode } from '@tramvai/tokens-render';
import { ForceCSRModule } from './ForceCSRModule';
import { sharedProviders } from './shared';

export * from './tokens';

declare module '@tramvai/react' {
  export interface PageComponentOptions {
    renderMode?: TramvaiRenderMode;
  }
}

// @todo: перенести в @tramvai/module-render
export const PageRenderModeModule = declareModule({
  name: 'PageRenderModeModule',
  imports: [...(process.env.__TRAMVAI_FORCE_CLIENT_SIDE_RENDERING ? [ForceCSRModule] : [])],
  providers: [...sharedProviders],
});
