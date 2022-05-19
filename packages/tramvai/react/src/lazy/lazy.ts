import type { LoadableComponent, DefaultComponent } from '@loadable/component';
import loadable from '@loadable/component';

interface Options {
  loading?: JSX.Element;
}

/**
 * @private Only for internal usage!
 * The method is intended to make it possible to wait for retries to synchronously load unsuccessful CSS assets
 */
export const __lazyErrorHandler = (error: any, load: () => Promise<any>) => {
  // This error from `mini-css-extract-plugin` fired, when a file loading initiated by this plugin failed.
  // By default, this error will cancel the loading of the component via `loadable`.
  // Now, we can add `__lazyErrorHandler` to catch block of any dynamic import,
  // and if failed assets was loaded again, `loadable` will not fail
  if (error?.code === 'CSS_CHUNK_LOAD_FAILED') {
    const failedLinkUrl = error.request;

    // `mini-css-extract-plugin` instantly removes failed link tags,
    // so we can expect only link tag from our recovery mechanism
    const fallbackLinkTag =
      document.querySelector(`link[href="${failedLinkUrl}"]`) ||
      document.querySelector(`link[data-href="${failedLinkUrl}"]`);

    if (fallbackLinkTag) {
      return load();
    }
  }
  throw error;
};

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

  // @ts-expect-error
  const originalImportAsync = load.importAsync;
  // @ts-expect-error
  // eslint-disable-next-line no-param-reassign
  load.importAsync = () =>
    originalImportAsync().catch((e: any) => __lazyErrorHandler(e, originalImportAsync));

  return loadable(load, {
    fallback: options.loading,
  });
};
