import React from 'react';
import { createApp, createBundle, createAction } from '@tramvai/core';
import { createEvent, createReducer, useStoreSelector, connect, useActions } from '@tramvai/state';
import { COMBINE_REDUCERS, CommonModule } from '@tramvai/module-common';
import { SpaRouterModule } from '@tramvai/module-router';
import { RenderModule } from '@tramvai/module-render';
import { ServerModule } from '@tramvai/module-server';
import { LogModule } from '@tramvai/module-log';

const selector = ({ id }) => id;
const rootEvent = createEvent('root');
const rootStore = createReducer('rootStore', { id: 0 }).on(rootEvent, ({ id }) => {
  return { id: id + 1 };
});
const childEvent = createEvent('child');
const childStore = createReducer('childStore', { id: 0 }).on(childEvent, ({ id }) => {
  return { id: id + 1 };
});
(rootStore as any).dependencies = [childStore];

const action = createAction({
  name: 'action',
  fn: (context) => {
    context.dispatch(childEvent());
    context.dispatch(rootEvent());
  },
});

const Child = connect([childStore], ({ childStore: { id } }) => ({ id }))((props: any) => {
  const state = props.id;

  if (state > 0) {
    throw new Error('');
  }

  return <div>{state}</div>;
});

const Root = () => {
  const state = useStoreSelector(rootStore, selector);
  const act = useActions(action);

  return (
    <div>
      <div id="content">{state}</div>
      {state === 0 ? (
        <div>
          <Child />
        </div>
      ) : (
        <div id="updated">no child</div>
      )}
      <button id="button" type="button" onClick={act}>
        Act
      </button>
    </div>
  );
};

const bundle = createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: Root,
  },
});

createApp({
  name: 'router',
  modules: [
    CommonModule,
    RenderModule,
    ServerModule,
    LogModule,
    SpaRouterModule.forRoot([{ name: 'root', path: '/' }]),
  ],
  providers: [
    {
      provide: COMBINE_REDUCERS,
      multi: true,
      useValue: [rootStore, childStore],
    },
  ],
  bundles: {
    mainDefault: () => Promise.resolve({ default: bundle }),
  },
});
