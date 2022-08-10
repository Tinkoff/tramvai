import type { ComponentType } from 'react';
import { provide } from '@tramvai/core';
import type { ModuleType, ExtendedModule, Provider, Action, TramvaiAction } from '@tramvai/core';
import type { ChildApp } from '@tramvai/tokens-child-app';
import { CHILD_APP_INTERNAL_RENDER_TOKEN } from '@tramvai/tokens-child-app';
import { renderWrapper } from './renderWrapper';

export interface ChildAppOptions {
  name: string;
  actions?: Array<Action | TramvaiAction<any[], any, any>>;
  modules?: (ModuleType | ExtendedModule)[];
  providers?: Provider[];

  render?: ComponentType<any>;
}

export const createChildApp = ({
  name,
  modules,
  actions,
  providers = [],
  render,
}: ChildAppOptions): ChildApp => {
  return {
    name,
    modules,
    actions,
    providers: [
      ...providers,
      ...(render
        ? [
            provide({
              provide: CHILD_APP_INTERNAL_RENDER_TOKEN,
              useValue: renderWrapper(render),
            }),
          ]
        : []),
    ],
  };
};
