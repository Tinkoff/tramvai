import flatten from '@tinkoff/utils/array/flatten';

import type { Provider } from '@tinkoff/dippy';
import { commandLineListTokens, provide } from '@tramvai/core';
import type {
  AbstractRouter,
  Route,
  Options,
  NavigationHook,
  NavigationSyncHook,
  NavigationGuard,
} from '@tinkoff/router';
import { setLogger } from '@tinkoff/router';

import { COMBINE_REDUCERS, LOGGER_TOKEN, COMPONENT_REGISTRY_TOKEN } from '@tramvai/tokens-common';
import {
  ROUTER_TOKEN,
  ROUTES_TOKEN,
  ROUTER_GUARD_TOKEN,
  PAGE_SERVICE_TOKEN,
  ROUTE_RESOLVE_TOKEN,
  ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN,
} from '@tramvai/tokens-router';
import {
  routerClassToken,
  onChangeHooksToken,
  additionalRouterParameters,
  beforeNavigateHooksToken,
  afterNavigateHooksToken,
  beforeResolveHooksToken,
  beforeUpdateCurrentHooksToken,
  afterUpdateCurrentHooksToken,
  routeTransformToken,
} from './tokens';

import { RouterStore } from '../stores/RouterStore';
import { commonGuards } from './guards/common';
import { commonHooks } from './hooks/common';
import { commonTokens } from './tokens/common';
import { PageService } from '../services/page';
import { providers as fsPagesProviders } from './fileSystemPages';

export const providers: Provider[] = [
  ...commonGuards,
  ...commonHooks,
  ...commonTokens,
  ...fsPagesProviders,
  {
    provide: ROUTER_TOKEN,
    useFactory: ({
      RouterClass,
      routes,
      routeTransform,
      routeResolve,
      additionalParameters,
    }: {
      RouterClass: new (opts: Options) => AbstractRouter;
      routes?: Route[];
      additionalParameters?: Record<string, any>;
      routeTransform: typeof routeTransformToken;
      routeResolve?: typeof ROUTE_RESOLVE_TOKEN;
    }) => {
      const router = new RouterClass({
        ...additionalParameters,
        trailingSlash: true,
        mergeSlashes: true,
        routes: flatten(routes ?? []).map(routeTransform),
      });

      if (routeResolve) {
        router.registerHook('beforeResolve', async (navigation) => {
          if (!router.resolve(navigation.url.href)) {
            const route = await routeResolve(navigation);

            if (route) {
              router.addRoute(routeTransform(route));
            }
          }
        });
      }

      return router;
    },
    deps: {
      RouterClass: routerClassToken,
      additionalParameters: {
        token: additionalRouterParameters,
        optional: true,
      },
      routes: {
        token: ROUTES_TOKEN,
        optional: true,
      },
      routeTransform: routeTransformToken,
      routeResolve: {
        token: ROUTE_RESOLVE_TOKEN,
        optional: true,
      },
    },
  },
  {
    provide: commandLineListTokens.customerStart,
    multi: true,
    useFactory: ({
      router,
      guards,
      onChange,
      beforeResolve,
      beforeNavigate,
      afterNavigate,
      beforeUpdateCurrent,
      afterUpdateCurrent,
    }: {
      router: AbstractRouter;
      guards?: NavigationGuard[];
      onChange?: NavigationSyncHook[];
      beforeResolve: NavigationHook[];
      beforeNavigate?: NavigationHook[];
      afterNavigate?: NavigationHook[];
      beforeUpdateCurrent?: NavigationHook[];
      afterUpdateCurrent?: NavigationHook[];
    }) => {
      return function routerInit() {
        flatten<NavigationGuard>(guards ?? []).forEach((guard) => router.registerGuard(guard));
        flatten<NavigationSyncHook>(onChange ?? []).forEach((hook) =>
          router.registerSyncHook('change', hook)
        );
        flatten<NavigationHook>(beforeResolve ?? []).forEach((hook) =>
          router.registerHook('beforeResolve', hook)
        );
        flatten<NavigationHook>(beforeNavigate ?? []).forEach((hook) =>
          router.registerHook('beforeNavigate', hook)
        );
        flatten<NavigationHook>(afterNavigate ?? []).forEach((hook) =>
          router.registerHook('afterNavigate', hook)
        );
        flatten<NavigationHook>(beforeUpdateCurrent ?? []).forEach((hook) =>
          router.registerHook('beforeUpdateCurrent', hook)
        );
        flatten<NavigationHook>(afterUpdateCurrent ?? []).forEach((hook) =>
          router.registerHook('afterUpdateCurrent', hook)
        );
      };
    },
    deps: {
      router: ROUTER_TOKEN,
      guards: {
        token: ROUTER_GUARD_TOKEN,
        optional: true,
      },
      onChange: {
        token: onChangeHooksToken,
        optional: true,
      },
      beforeResolve: {
        token: beforeResolveHooksToken,
        optional: true,
      },
      beforeNavigate: {
        token: beforeNavigateHooksToken,
        optional: true,
      },
      afterNavigate: {
        token: afterNavigateHooksToken,
        optional: true,
      },
      beforeUpdateCurrent: {
        token: beforeUpdateCurrentHooksToken,
        optional: true,
      },
      afterUpdateCurrent: {
        token: afterUpdateCurrentHooksToken,
        optional: true,
      },
    },
  },
  {
    provide: commandLineListTokens.init,
    multi: true,
    useFactory: ({ logger }: { logger: typeof LOGGER_TOKEN }) => {
      return function routerSetLogger() {
        setLogger(logger('route:router'));
      };
    },
    deps: {
      logger: LOGGER_TOKEN,
    },
  },
  {
    provide: ROUTER_SPA_ACTIONS_RUN_MODE_TOKEN,
    // TODO: пока делаем after т.к. на это рассчитывает большинство приложений и у нас пока нет механизма контроля выполнения экшенов, чтобы
    // избежать случаев зависания перехода из-за долгих экшенов
    // рассмотреть возможность замены после доработок экшенов
    useValue: 'after',
  },
  provide({
    provide: PAGE_SERVICE_TOKEN,
    useClass: PageService,
    deps: {
      router: ROUTER_TOKEN,
      componentRegistry: COMPONENT_REGISTRY_TOKEN,
    },
  }),
  {
    provide: COMBINE_REDUCERS,
    multi: true,
    useValue: RouterStore,
  },
];
