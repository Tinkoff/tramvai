import type { LoadableComponent, DefaultComponent } from '@loadable/component';
import loadable from '@loadable/component';

interface Options {
  loading?: JSX.Element;
}

export const lazy = <Props, Component>(
  load: (props?: Props) => Promise<DefaultComponent<Props>>,
  options: Options = {}
): LoadableComponent<Props> => {
  if (process.env.NODE_ENV === 'development') {
    if (!('requireAsync' in load)) {
      console.error(`Lazy import was not processed by lazy-component babel plugin.
Check lazy helper usage, expected signature is "lazy(() => import('./path/to/component'))",
the first argument should be transformed into a special object, but the current value is
"${load.toString()}"`);
    }
  }
  return loadable(load, {
    fallback: options.loading,
  });
};
