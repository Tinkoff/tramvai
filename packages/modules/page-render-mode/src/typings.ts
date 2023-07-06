import type { TramvaiRenderMode } from '@tramvai/tokens-render';

declare module '@tinkoff/router' {
  export interface RouteConfig {
    pageRenderMode?: TramvaiRenderMode;
  }
}

declare module '@tramvai/react' {
  export interface PageComponentOptions {
    renderMode?: TramvaiRenderMode;
  }
}
