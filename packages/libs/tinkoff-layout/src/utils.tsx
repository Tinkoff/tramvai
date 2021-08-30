import flatten from '@tinkoff/utils/array/flatten';
import type { ReactComponent, Wrapper, LayoutOptions } from './types.h';

const toArray = <T extends any>(arr: T | T[]) => (Array.isArray(arr) ? arr : [arr]);

export const composeComponent = (
  Component: ReactComponent,
  wrappers: Wrapper | Wrapper[]
): ReactComponent => {
  return toArray(wrappers ?? []).reduce((Wrapped, wrapper) => wrapper(Wrapped), Component);
};

export const composeLayoutOptions = (list: LayoutOptions[]): LayoutOptions => {
  return flatten<LayoutOptions>(list ?? []).reduce(
    (acc, item) => {
      const { components, wrappers } = acc;
      if (item.components) {
        Object.assign(components, item.components);
      }
      if (item.wrappers) {
        Object.keys(item.wrappers).forEach((component) => {
          if (!wrappers[component]) {
            wrappers[component] = [];
          }
          (wrappers[component] as Wrapper[]).push(...toArray(item.wrappers[component]));
        });
      }
      return acc;
    },
    {
      components: {},
      wrappers: {},
    }
  );
};
