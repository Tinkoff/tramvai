import { createToken } from '@tinkoff/dippy';
import type { ComponentType } from 'react';
import type { TramvaiRenderMode } from '@tramvai/tokens-render';

export const PAGE_RENDER_FALLBACK_COMPONENT_PREFIX = createToken<string>(
  'pageRenderFallbackComponentName'
);

/**
 * @deprecated Use token `TRAMVAI_RENDER_MODE` from `@tramvai/tokens-render`
 */
export const PAGE_RENDER_DEFAULT_MODE = createToken<TramvaiRenderMode>('pageRenderDefaultMode');

export const PAGE_RENDER_WRAPPER_TYPE = createToken<'layout' | 'content' | 'page'>(
  'pageRenderWrapperType'
);

export const PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT = createToken<ComponentType<any>>(
  'pageRenderDefaultFallbackComponent'
);
