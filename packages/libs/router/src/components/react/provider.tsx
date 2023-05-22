import type { FunctionComponent, ReactNode } from 'react';
import { useMemo } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import type { Url } from '@tinkoff/url';
import { RouterContext, RouteContext, UrlContext } from './context';
import type { AbstractRouter } from '../../router/abstract';
import type { NavigationRoute } from '../../types';

export const Provider: FunctionComponent<{
  router: AbstractRouter;
  serverState?: { currentRoute: NavigationRoute; currentUrl: Url };
  children?: ReactNode;
}> = ({ router, serverState, children }) => {
  // fallback to outdate router implementation
  const lastRoute = useMemo(() => router.getCurrentRoute(), [router]);
  const lastUrl = useMemo(() => router.getCurrentUrl(), [router]);

  const route = useSyncExternalStore(
    (cb) => router.registerSyncHook('change', cb),
    () => router.getLastRoute?.() ?? lastRoute,
    serverState ? () => serverState.currentRoute : () => router.getLastRoute?.() ?? lastRoute
  );

  const url = useSyncExternalStore(
    (cb) => router.registerSyncHook('change', cb),
    () => router.getLastUrl?.() ?? lastUrl,
    serverState ? () => serverState.currentUrl : () => router.getLastUrl?.() ?? lastUrl
  );

  return (
    <RouterContext.Provider value={router}>
      <RouteContext.Provider value={route}>
        <UrlContext.Provider value={url}>{children}</UrlContext.Provider>
      </RouteContext.Provider>
    </RouterContext.Provider>
  );
};

Provider.displayName = 'TinkoffRouterProvider';
