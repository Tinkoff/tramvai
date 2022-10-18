import { createApp, provide } from '@tramvai/core';
import { CommonModule } from '@tramvai/module-common';
import { SpaRouterModule } from '@tramvai/module-router';
import { RenderModule } from '@tramvai/module-render';
import { ServerModule } from '@tramvai/module-server';
import { ErrorInterceptorModule } from '@tramvai/module-error-interceptor';
import { SeoModule } from '@tramvai/module-seo';
import {
  DEFAULT_HEADER_COMPONENT,
  DEFAULT_FOOTER_COMPONENT,
  RENDER_SLOTS,
  ResourceType,
  ResourceSlot,
  REACT_SERVER_RENDER_MODE,
} from '@tramvai/tokens-render';

import { Header } from './components/features/Header/Header';
import { Footer } from './components/features/Footer/Footer';
import { globalAction } from './actions/globalAction';

createApp({
  name: 'render-to-stream',
  modules: [
    CommonModule,
    SpaRouterModule,
    RenderModule.forRoot({ useStrictMode: true }),
    SeoModule,
    ServerModule,
    ErrorInterceptorModule,
  ],
  providers: [
    // регистрируем header, который будет использоваться для всех страниц по умолчанию
    {
      provide: DEFAULT_HEADER_COMPONENT,
      useValue: Header,
    },
    // регистрируем footer, который будет использоваться для всех страниц по умолчанию
    {
      provide: DEFAULT_FOOTER_COMPONENT,
      useValue: Footer,
    },
    // регистрируем meta viewport, который будет добавлятся на каждую страницу
    {
      provide: RENDER_SLOTS,
      multi: true,
      useValue: {
        type: ResourceType.asIs,
        slot: ResourceSlot.HEAD_META,
        payload: '<meta name="viewport" content="width=device-width, initial-scale=1">',
      },
    },
    provide({
      provide: REACT_SERVER_RENDER_MODE,
      useValue: 'streaming',
    }),
  ],
  // регистрируем экшены, которые будут выполняться для всех страниц приложения
  actions: [globalAction],
});
