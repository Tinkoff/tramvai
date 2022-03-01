import { Module } from '@tramvai/core';
import { LAYOUT_OPTIONS } from '@tramvai/tokens-render';
import { pageRenderHOC } from './PageRenderWrapper';
import { PAGE_RENDER_FALLBACK_COMPONENT_PREFIX, PAGE_RENDER_DEFAULT_MODE } from './tokens';

export * from './types';
export * from './tokens';

@Module({
  providers: [
    {
      provide: LAYOUT_OPTIONS,
      multi: true,
      useValue: {
        wrappers: {
          page: pageRenderHOC,
        },
      },
    },
    {
      provide: PAGE_RENDER_FALLBACK_COMPONENT_PREFIX,
      useValue: 'pageRenderFallback',
    },
    {
      provide: PAGE_RENDER_DEFAULT_MODE,
      useValue: 'ssr',
    },
  ],
})
export class PageRenderModeModule {}
