import React from 'react';
import { createApp, createBundle, createAction } from '@tramvai/core';
import { SpaRouterModule, useNavigate, useUrl } from '@tramvai/module-router';
import { RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { NotFoundError } from '@tinkoff/errors';
import { modules } from '../common';

const Navigation = ['/'];

const fetchSomeData = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject();
    }, 100);
  });

const pageAction = createAction({
  name: 'pageAction',
  fn: async (_, __, { responseManager }) => {
    try {
      await fetchSomeData();
    } catch (e) {
      const isCriticalDataError = false;

      if (isCriticalDataError) {
        // if you throw NotFoundError, Page component will not be rendered, response body will be empty
        throw new NotFoundError();
      } else {
        // otherwise, if you only change response status, Page component will be rendered without neccesary data
        responseManager.setStatus(500);
      }
    }
  },
  deps: {
    responseManager: RESPONSE_MANAGER_TOKEN,
  },
});

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

Page.actions = [pageAction];

const NotFoundRoot = () => {
  return 'not found root';
};

const bundle = createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: Page,
    notFoundRoot: NotFoundRoot,
  },
});

createApp({
  name: 'router-action-error',
  modules: [
    SpaRouterModule.forRoot([
      {
        name: 'root',
        path: '/',
      },
      {
        name: 'not-found-root',
        path: '*',
        config: {
          pageComponent: 'notFoundRoot',
        },
      },
    ]),
    ...modules,
  ],
  bundles: {
    mainDefault: () => Promise.resolve({ default: bundle }),
  },
});
