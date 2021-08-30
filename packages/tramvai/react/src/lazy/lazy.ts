import type { ComponentType } from 'react';
import loadable from '@loadable/component';

type Module<P> = {
  default: P;
};

interface Options {
  loading?: JSX.Element;
}

export const lazy = <
  P,
  Component extends ComponentType<P> = ComponentType<P>,
  Export extends Module<Component> = Module<Component>
>(
  load: (props?: P) => Promise<Export>,
  options: Options = {}
) =>
  loadable(load, {
    fallback: options.loading,
  });
