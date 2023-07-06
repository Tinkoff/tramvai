import type { ComponentType } from 'react';
import { createToken } from '@tinkoff/dippy';
import type { TramvaiRenderMode } from '@tramvai/tokens-render';
import type { Cache, ResponseManager } from '@tramvai/tokens-common';
import type { commandLineListTokens } from '@tramvai/tokens-core';

export const PAGE_RENDER_FALLBACK_COMPONENT_PREFIX = createToken<string>(
  'pageRenderFallbackComponentName'
);

/**
 * @deprecated Use token `TRAMVAI_RENDER_MODE` from `@tramvai/tokens-render`
 */
export const PAGE_RENDER_DEFAULT_MODE = createToken<TramvaiRenderMode | (() => TramvaiRenderMode)>(
  'pageRenderDefaultMode'
);

export const PAGE_RENDER_WRAPPER_TYPE = createToken<'layout' | 'content' | 'page'>(
  'pageRenderWrapperType'
);

export const PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT = createToken<ComponentType<any>>(
  'pageRenderDefaultFallbackComponent'
);

export interface StaticPagesCacheEntry {
  updatedAt: number;
  headers: ReturnType<ResponseManager['getHeaders']>;
  status: ReturnType<ResponseManager['getStatus']>;
  body: string;
}

export interface StaticPagesOptions {
  /**
   * Static page cache live time in milliseconds
   * @default 60000
   */
  ttl: number;
  /**
   * Cached static page maximum size
   * @default 1000
   */
  maxSize: number;
}

export const STATIC_PAGES_CACHE_TOKEN =
  createToken<Cache<Map<string, StaticPagesCacheEntry>>>('static pages cache');

export const STATIC_PAGES_SHOULD_USE_CACHE = createToken<() => boolean>(
  'static pages should use cache',
  { multi: true }
);

export const STATIC_PAGES_BACKGROUND_FETCH_ENABLED = createToken<() => boolean>(
  'static pages can fetch page'
);

export const STATIC_PAGES_OPTIONS_TOKEN = createToken<StaticPagesOptions>('static pages options');

export const STATIC_PAGES_COMMAND_LINE = createToken<keyof typeof commandLineListTokens>(
  'static pages command line'
);

export const STATIC_PAGES_MODIFY_CACHE = createToken<
  (entry: StaticPagesCacheEntry) => StaticPagesCacheEntry
>('static pages modify cache', { multi: true });

export const STATIC_PAGES_CACHE_5xx_RESPONSE = createToken<() => boolean>(
  'static pages cache 5xx response'
);
