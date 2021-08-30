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

// экшены можно задавать как статичное свойство page-компонента - тогда экшены будут выпоолняться только при переходе на
// страницы где указан этот конкретный pageComponent
Page.actions = [pageInLimit, pageOutLimit];
