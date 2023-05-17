import type { FunctionComponent, ReactNode } from 'react';
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
  const route = useSyncExternalStore(
    (cb) => router.registerSyncHook('change', cb),
    () => router.getLastRoute(),
    serverState ? () => serverState.currentRoute : () => router.getLastRoute()
  );

  const url = useSyncExternalStore(
    (cb) => router.registerSyncHook('change', cb),
    () => router.getLastUrl(),
    serverState ? () => serverState.currentUrl : () => router.getLastUrl()
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
