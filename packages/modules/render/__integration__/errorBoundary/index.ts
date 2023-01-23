import React from 'react';
import { commandLineListTokens, createApp, provide } from '@tramvai/core';
import { CommonModule, REQUEST_MANAGER_TOKEN, STORE_TOKEN } from '@tramvai/module-common';
import { SpaRouterModule, ROUTER_GUARD_TOKEN } from '@tramvai/module-router';
import { RenderModule, setPageErrorEvent } from '@tramvai/module-render';
import { ServerModule } from '@tramvai/module-server';
import {
  ERROR_BOUNDARY_FALLBACK_COMPONENT_TOKEN,
  ROOT_ERROR_BOUNDARY_COMPONENT_TOKEN,
} from '@tramvai/react';
import { HttpError, throwHttpError } from '@tinkoff/errors';
import { parse } from '@tinkoff/url';
import { DEFAULT_ERROR_BOUNDARY_COMPONENT } from '@tramvai/tokens-render';
import { LegacyErrorBoundary } from './components/LegacyErrorBoundary';
import { RootErrorBoundary } from './components/RootErrorBoundary';
import { TokenDefaultErrorBoundary } from './components/TokenDefaultErrorBoundary';

createApp({
  name: 'render-error-boundary',
  modules: [
    CommonModule,
    SpaRouterModule.forRoot([
      {
        name: 'success',
        path: '/',
        config: {},
      },
      {
        name: 'page-error-default-fallback',
        path: '/page-error-default-fallback/',
        config: {
          pageComponent: 'errorPageComponent',
        },
      },
      {
        name: 'page-error-specific-fallback',
        path: '/page-error-specific-fallback/',
        config: {
          pageComponent: 'errorPageComponent',
          errorBoundaryComponent: 'pageErrorBoundaryComponent',
        },
      },
      {
        name: 'page-error-fs-specific-fallback',
        path: '/page-error-fs-specific-fallback/',
        config: {
          pageComponent: '@/pages/error-page',
          errorBoundaryComponent: '@/pages/error-boundary',
        },
      },
      {
        name: 'page-error-not-existed',
        path: '/page-error-not-existed/',
        config: {
          pageComponent: 'notExistedPageComponent',
        },
      },
      {
        name: 'legacy-error-boundary',
        path: '/legacy-error-boundary/',
        config: {
          bundle: 'legacy',
        },
      },
      {
        name: 'token-default-error-boundary',
        path: '/token-default-error-boundary/',
        config: {
          bundle: 'error',
        },
      },
      {
        name: 'page-action-error',
        path: '/page-action-error/',
        config: {
          pageComponent: 'pageActionErrorComponent',
        },
      },
      {
        name: 'page-guard-error',
        path: '/page-guard-error/',
        config: {
          pageComponent: 'pageGuardErrorComponent',
        },
      },
      {
        name: 'global-error',
        path: '/global-error/',
        config: {},
      },
    ]),
    RenderModule,
    ServerModule,
  ],
  bundles: {
    mainDefault: () => import(/* webpackChunkName: 'mainDefault' */ './bundles/mainDefault'),
    legacy: () => import(/* webpackChunkName: 'legacy' */ './bundles/legacy'),
    error: () => import(/* webpackChunkName: 'error' */ './bundles/error'),
  },
  providers: [
    provide({
      provide: ERROR_BOUNDARY_FALLBACK_COMPONENT_TOKEN,
      useValue: React.createElement(LegacyErrorBoundary),
    }),
    provide({
      provide: ROOT_ERROR_BOUNDARY_COMPONENT_TOKEN,
      useValue: RootErrorBoundary,
    }),
    ...(process.env.TEST_DEFAULT_ERROR_BOUNDARY
      ? [
          provide({
            provide: DEFAULT_ERROR_BOUNDARY_COMPONENT,
            useValue: TokenDefaultErrorBoundary,
          }),
        ]
      : []),
    provide({
      provide: ROUTER_GUARD_TOKEN,
      multi: true,
      useFactory: ({ store }): typeof ROUTER_GUARD_TOKEN => {
        return async ({ to }) => {
          if (to?.path === '/page-guard-error/') {
            const error = new HttpError({
              httpStatus: 503,
            });

            store.dispatch(setPageErrorEvent(error));
          }
        };
      },
      deps: {
        store: STORE_TOKEN,
      },
    }),
    provide({
      provide: commandLineListTokens.customerStart,
      multi: true,
      useFactory: ({ requestManager }) => {
        return function throwGlobalError() {
          if (parse(requestManager.getUrl()).path === '/global-error/') {
            throwHttpError({ message: 'Global Error', httpStatus: 503 });
          }
        };
      },
      deps: {
        requestManager: REQUEST_MANAGER_TOKEN,
      },
    }),
  ],
});
