import type { TramvaiRenderMode } from '@tramvai/tokens-render';

declare module '@tramvai/react' {
  export interface PageComponentOptions {
    renderMode?: TramvaiRenderMode;
  }
}
