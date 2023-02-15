import type { ChildAppRequestConfig } from '@tramvai/tokens-child-app';

declare module '@tramvai/react' {
  export interface PageComponentOptions {
    childApps?: ChildAppRequestConfig[];
  }

  export interface LayoutComponentOptions {
    childApps?: ChildAppRequestConfig[];
  }

  export interface MetaComponentOptions {
    childApps?: ChildAppRequestConfig[];
  }
}
