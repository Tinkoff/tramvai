import type { Provider } from '@tinkoff/dippy';
import { LAYOUT_OPTIONS, TRAMVAI_RENDER_MODE } from '@tramvai/tokens-render';
import { pageRenderHOC } from './PageRenderWrapper';
import {
  PAGE_RENDER_FALLBACK_COMPONENT_PREFIX,
  PAGE_RENDER_DEFAULT_MODE,
  PAGE_RENDER_WRAPPER_TYPE,
} from './tokens';

export const sharedProviders: Provider[] = [
  {
    provide: LAYOUT_OPTIONS,
    multi: true,
    useFactory: ({ wrapperType }) => {
      return {
        wrappers: {
          [wrapperType]: pageRenderHOC,
        },
      };
    },
    deps: {
      wrapperType: PAGE_RENDER_WRAPPER_TYPE,
    },
  },
  {
    provide: PAGE_RENDER_FALLBACK_COMPONENT_PREFIX,
    useValue: 'pageRenderFallback',
  },
  {
    provide: PAGE_RENDER_DEFAULT_MODE,
    useFactory: ({ tramvaiRenderMode }) => {
      return tramvaiRenderMode;
    },
    deps: {
      tramvaiRenderMode: TRAMVAI_RENDER_MODE,
    },
  },
  {
    provide: PAGE_RENDER_WRAPPER_TYPE,
    useValue: 'page',
  },
];
