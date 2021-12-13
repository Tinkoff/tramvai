import React from 'react';
import { createReducer, createEvent } from '@tramvai/state';
import { createApp, createBundle, createAction } from '@tramvai/core';
import { SpaRouterModule, ROUTER_GUARD_TOKEN, useNavigate, useUrl } from '@tramvai/module-router';
import { STORE_TOKEN, CONTEXT_TOKEN, COMBINE_REDUCERS } from '@tramvai/module-common';
import { modules } from '../common';

const Navigation = ['/1/', '/2/', '/3/', '/redirect/', '/block/'];

function Page() {
  const navigate = useNavigate();
  const { pathname, path } = useUrl();

  return (
    <div>
      <div>Current Path: {path}</div>
      {Navigation.map((p) => {
        if (p !== pathname) {
          return (
            <button type="button" onClick={() => navigate({ url: p })}>
              Navigate to {p}
            </button>
          );
        }

        return null;
      })}
    </div>
  );
}

const bundle = createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: Page,
  },
});

const event = createEvent<boolean>('event');
const store = createReducer<boolean | void>('store', undefined).on(event, (_, val) => val);

const action = createAction({
  name: 'action',
  fn: async (context) => {
    await new Promise<void>((res) => setTimeout(res, 1200));

    return context.dispatch(event(true));
  },
});

createApp({
  name: 'router-guards',
  modules: [
    SpaRouterModule.forRoot([
      {
        name: 'root',
        path: '/',
      },
      {
        name: '1',
        path: '/1/',
      },
      {
        name: '2',
        path: '/2/',
      },
      {
        name: '3',
        path: '/3/',
      },
      {
        name: 'redirect',
        path: '/redirect/',
      },
      {
        name: 'block',
        path: '/block/',
      },
    ]),
    ...modules,
  ],
  providers: [
    {
      provide: COMBINE_REDUCERS,
      multi: true,
      useValue: store,
    },
    {
      provide: ROUTER_GUARD_TOKEN,
      multi: true,
      useValue: async ({ to }) => {
        if (to.path === '/redirect/') {
          // we can make a redirect from the guard
          return '/3/';
        }
      },
    },
    {
      provide: ROUTER_GUARD_TOKEN,
      multi: true,
      useFactory: ({ store: state, context }) => {
        return async ({ to }) => {
          if (to.path === '/block/') {
            if (state.getState().store === undefined) {
              await context.executeAction(action);
            }

            if (state.getState().store) {
              // we can block navigation
              return false;
            }
          }
        };
      },
      deps: {
        store: STORE_TOKEN,
        context: CONTEXT_TOKEN,
      },
    },
  ],
  bundles: {
    mainDefault: () => Promise.resolve({ default: bundle }),
  },
});
