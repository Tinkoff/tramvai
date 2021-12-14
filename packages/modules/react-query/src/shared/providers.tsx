import type { ReactElement } from 'react';
import React from 'react';
import type { Provider } from '@tramvai/core';
import { APP_INFO_TOKEN } from '@tramvai/core';
import { provide } from '@tramvai/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { CHILD_APP_INTERNAL_CONFIG_TOKEN } from '@tramvai/tokens-child-app';
import { EXTEND_RENDER } from '@tramvai/tokens-render';
import {
  QUERY_CLIENT_TOKEN,
  QUERY_CLIENT_DEHYDRATED_STATE_TOKEN,
  QUERY_CLIENT_DEFAULT_OPTIONS_TOKEN,
  QUERY_DEHYDRATE_STATE_NAME_TOKEN,
} from '../tokens';

export const sharedQueryProviders: Provider[] = [
  provide({
    provide: QUERY_CLIENT_TOKEN,
    useFactory: ({ defaultOptions }) => {
      return new QueryClient({
        defaultOptions,
      });
    },
    deps: {
      defaultOptions: QUERY_CLIENT_DEFAULT_OPTIONS_TOKEN,
    },
  }),
  provide({
    provide: QUERY_CLIENT_DEFAULT_OPTIONS_TOKEN,
    useValue: {
      queries: {
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  }),
  provide({
    provide: EXTEND_RENDER,
    multi: true,
    useFactory: ({ queryClient, state }) => {
      return (render: ReactElement) => {
        return (
          <QueryClientProvider client={queryClient}>
            <Hydrate state={state}>{render}</Hydrate>
          </QueryClientProvider>
        );
      };
    },
    deps: {
      queryClient: QUERY_CLIENT_TOKEN,
      state: QUERY_CLIENT_DEHYDRATED_STATE_TOKEN,
    },
  }),
  provide({
    provide: QUERY_DEHYDRATE_STATE_NAME_TOKEN,
    useFactory: ({ childAppConfig, appInfo }) => {
      return `__REACT_QUERY_STATE__${childAppConfig?.key ?? appInfo.appName}`;
    },
    deps: {
      childAppConfig: { token: CHILD_APP_INTERNAL_CONFIG_TOKEN, optional: true },
      appInfo: APP_INFO_TOKEN,
    },
  }),
];
