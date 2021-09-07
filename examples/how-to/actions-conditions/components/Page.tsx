import reduceObj from '@tinkoff/utils/object/reduce';
import React from 'react';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import { useSelector } from '@tramvai/state';
import { useDi } from '@tramvai/react';
import { store } from '../store';
import {
  pageBrowserAction,
  pageServerAction,
  pageAlwaysAction,
  pageBrowserAlwaysAction,
} from '../actions/page';
import { customAction } from '../actions/custom';

export function Page() {
  const state = useSelector(store, (x) => x.actionTest);
  const pageService = useDi(PAGE_SERVICE_TOKEN);

  return (
    <div>
      <button type="button" onClick={() => pageService.navigate({ url: '/custom/' })}>
        Navigate To custom
      </button>
      {reduceObj(
        (acc, v, k) => {
          return acc.concat(
            <div>
              {k} loaded from {v}
            </div>
          );
        },
        [],
        state
      )}
    </div>
  );
}

Page.actions = [
  pageServerAction,
  pageBrowserAction,
  pageAlwaysAction,
  pageBrowserAlwaysAction,
  customAction,
];
