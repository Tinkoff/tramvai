import type { LoadableComponent, DefaultComponent } from '@loadable/component';
import loadable from '@loadable/component';

interface Options {
  loading?: JSX.Element;
}

export const lazy = <Props, Component>(
  load: (props?: Props) => Promise<DefaultComponent<Props>>,
  options: Options = {}
): LoadableComponent<Props> =>
  loadable(load, {
    fallback: options.loading,
  });
