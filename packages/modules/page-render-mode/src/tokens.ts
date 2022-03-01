import { createToken } from '@tinkoff/dippy';
import type { ComponentType } from 'react';
import type { PageRenderMode } from '.';

export const PAGE_RENDER_FALLBACK_COMPONENT_PREFIX = createToken<string>(
  'pageRenderFallbackComponentName'
);

export const PAGE_RENDER_DEFAULT_MODE = createToken<PageRenderMode>('pageRenderDefaultMode');

export const PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT = createToken<ComponentType<any>>(
  'pageRenderDefaultFallbackComponent'
);
