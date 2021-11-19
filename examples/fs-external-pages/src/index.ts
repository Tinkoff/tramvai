import { createApp } from '@tramvai/core';
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
} from '@tramvai/tokens-render';

import { Header } from './components/features/Header/Header';
import { Footer } from './components/features/Footer/Footer';
import { globalAction } from './actions/globalAction';

createApp({
  name: 'fs-external-pages',
  modules: [
    CommonModule,
    SpaRouterModule.forRoot([
      // задаем статичный роут для приложения, который будет доступен по https://localhost:3000/
      // загружаем на нем file-system компонент страницы
      {
        name: 'main',
        path: '/',
        config: {
          pageComponent: '@/external-pages/MainPage',
        },
      },
      // задаем статичный роут для приложения, который будет доступен по https://localhost:3000/second/
      // загружаем на нем file-system компонент страницы
      {
        name: 'second',
        path: '/second/',
        config: {
          pageComponent: '@/external-pages/SecondPage',
          // меняем дефолтный layout страницы
          layoutComponent: 'second-page/layout',
        },
      },
      // задаем статичный роут для приложения, который будет доступен по https://localhost:3000/old/
      // загружаем на нем компонент страницы из бандла
      {
        name: 'old',
        path: '/old/',
        config: {
          bundle: 'oldBundle',
          pageComponent: 'oldBundle/OldPage',
        },
      },
    ]),
    RenderModule.forRoot({ mode: 'strict' }),
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
  ],
  // регистрируем экшены, которые будут выполняться для всех страниц приложения
  actions: [globalAction],
  bundles: {
    oldBundle: () => import(/* webpackChunkName: "oldBundle" */ './bundles/oldBundle'),
  },
});
