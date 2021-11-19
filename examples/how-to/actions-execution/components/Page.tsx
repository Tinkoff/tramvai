import reduceObj from '@tinkoff/utils/object/reduce';
import React from 'react';
import { useSelector } from '@tramvai/state';
import { store } from '../store';
import { pageInLimit, pageOutLimit } from '../actions/page';

export function Page() {
  const state = useSelector(store, (x) => x.actionTest);

  return (
    <div>
      {reduceObj(
        (acc, v, k) => {
          return acc.concat(
            <div>
              {k} = {v.toString()}
            </div>
          );
        },
        [],
        state
      )}
    </div>
  );
}

// actions can be specified as a static property of a page component
// in this case actions will be executed only on pages with this particular pageComponent
Page.actions = [pageInLimit, pageOutLimit];
