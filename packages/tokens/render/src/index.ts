import type { ReactElement, ComponentType } from 'react';
import { createToken } from '@tinkoff/dippy';
import { StorageRecord } from '@tinkoff/htmlpagebuilder';
import type { UniversalErrorBoundaryFallbackProps } from '@tramvai/react';
import * as ResourceSlot from './slots';

/**
 * @description
 * Token adding resources to specific render slots.
 * Used only on server and it is equivalent to usage of RESOURCES_REGISTRY.
 *
 * [Usage example](https://tramvai.dev/docs/how-to/render-add-resources)
 */
export const RENDER_SLOTS = createToken<PageResource | PageResource[]>('RENDER_SLOTS', {
  multi: true,
});

/**
 * @description
 * Token for defining additional attributes for html, body and app container. Keep in mind that:
 *  - only raw html attributes are allowed (not react or anything else, e.g. do not use className use class)
 *  - new attributes overrides old one
 *  - only text values are supported
 *
 * @example
  ```tsx
  {
    provide: HTML_ATTRS,
    useValue: {
      target: 'body',
      attrs: {
        class: 'custom-class',
      },
    },
    multi: true,
  },
  ```
 */
export const HTML_ATTRS = createToken<HtmlAttrs>('HTML_ATTRS', { multi: true });

/**
 * @description
 * Add node-style callback on render event in browser.
 * Passes error instance as first argument if there was an error
 */
export const RENDERER_CALLBACK = createToken<(e?: Error) => void>('RENDERER_CALLBACK', {
  multi: true,
});

/**
 * @description
 * Used as async function which overrides app render. This function may define render parameters or override render result.
 */
export const CUSTOM_RENDER =
  createToken<(content: JSX.Element) => Promise<string>>('CUSTOM_RENDER');

/**
 * @description
 * Resources registry is used only on server for registering any additional assets for browser (scripts, styles, html) which should be added to response html page
 */
export const RESOURCES_REGISTRY = createToken<ResourcesRegistry>('resourcesRegistry');

/**
 * @description
 * A string used for check of need to loading polyfills in the client browser.
 * Polyfills are always loading for browsers without module support and if browser do support modules
 * this check will called in order to find out the need of loading polyfills
 * (by default checks for Promise.prototype.finally and implementations for URL and URLSearchParams)
 *
 * [Polyfill documentation](https://tramvai.dev/docs/how-to/how-to-enable-polyfills)
 */
export const POLYFILL_CONDITION = createToken<string>('POLYFILL_CONDITION');

/**
 * @deprecated tramvai will automatically detect React version, and use hydrateRoot API for 18+ version
 * For Strict Mode, use token `USE_REACT_STRICT_MODE`
 */
export const RENDER_MODE = createToken<RenderMode>('RENDER_MODE');

/**
 * @description add Strict Mode wrapper, more info available in documentation https://reactjs.org/docs/strict-mode.html
 */
export const USE_REACT_STRICT_MODE = createToken<boolean>('useReactStrictMode');

/**
 * @description
 * A wrapper for app render.
 * Through that token is possible to specify for example React.Context.Provider for the app
 */
export const EXTEND_RENDER = createToken<(current: ReactElement) => ReactElement>('EXTEND_RENDER', {
  multi: true,
});

/**
 * @description
 * Token for default layout for all pages - root layout
 */
export const DEFAULT_LAYOUT_COMPONENT = createToken('defaultLayoutComponent');

/**
 * @description
 * Token for default header for page
 */
export const DEFAULT_HEADER_COMPONENT = createToken('defaultHeaderComponent');

/**
 * @description
 * Token for default footer for page
 */
export const DEFAULT_FOOTER_COMPONENT = createToken('defaultFooterComponent');

/**
 * @description
 * Token for default Error Boundary for page
 */
export const DEFAULT_ERROR_BOUNDARY_COMPONENT = createToken<
  ComponentType<UniversalErrorBoundaryFallbackProps>
>('defaultErrorBoundaryComponent');

/**
 * @description
 * Token for passing parameters for page layout
 */
export const LAYOUT_OPTIONS = createToken<LayoutOptions | LayoutOptions[]>('layoutOptions', {
  multi: true,
});

type ReactComponent = ComponentType<any>;

type Wrapper = (WrappedComponent: ReactComponent) => ReactComponent;

export interface LayoutOptions {
  components?: Record<string, ReactComponent>;
  wrappers?: Record<string, Wrapper | Wrapper[]>;
}

export interface PageResource {
  type: keyof typeof StorageRecord;
  slot: typeof ResourceSlot[keyof typeof ResourceSlot];
  payload: string | null;
  attrs?: Record<string, string | null>;
}

export interface ResourcesRegistry {
  register(resource: PageResource | PageResource[]): void;
  getPageResources(): PageResource[];
  prefetchInlinePageResources(): Promise<any>;
}

export type HtmlAttrs = {
  target: 'html' | 'body' | 'app';
  attrs: { [name: string]: string | boolean | Record<string, any> | number };
};

/**
 * @deprecated
 */
export type RenderMode = 'legacy' | 'strict' | 'blocking' | 'concurrent';

type ResourceInlineOptions = {
  threshold: number;
  types: (keyof typeof StorageRecord)[];
};

/**
 * @description
 * Settings for HTML resources inlining
 * * threshold Maximum value (in bytes) of the file which are getting inlined in HTML page
 * * types Types of resources which should be inlined
 */
export const RESOURCE_INLINE_OPTIONS =
  createToken<ResourceInlineOptions>('resourceInlineThreshold');

/**
 * @description
 * Experimental switcher from ssr to client-side rendering mode
 */
export const TRAMVAI_RENDER_MODE = createToken<TramvaiRenderMode>('tramvaiRenderMode');

export type TramvaiRenderMode = 'ssr' | 'client' | 'static';

export { ResourceSlot };
export { StorageRecord as ResourceType };

export const RENDER_FLOW_AFTER_TOKEN = createToken<() => Promise<void>>('render flow after', {
  multi: true,
});

export const MODERN_SATISFIES_TOKEN = createToken<boolean>('modernSatisfies');

export const BACK_FORWARD_CACHE_ENABLED = createToken<boolean>('back forward cache');

export type ReactServerRenderMode = 'sync' | 'streaming';

export const REACT_SERVER_RENDER_MODE = createToken<ReactServerRenderMode>('reactServerRenderMode');

export interface WebpackStats {
  assetsByChunkName: Record<string, string[]>;
  namedChunkGroups?: Record<string, { name: string; chunks: string[]; assets: string[] }>;
  entrypoints: Record<string, { name: string; chunks: string[]; assets: string[] }>;
  publicPath: string;
  [key: string]: any;
}

type FetchWebpackStatsFn = (payload?: { modern?: boolean }) => Promise<WebpackStats>;

export const FETCH_WEBPACK_STATS_TOKEN = createToken<FetchWebpackStatsFn>('fetchWebpackStatsFn');
