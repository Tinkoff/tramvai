import T from '@tinkoff/utils/function/T';
import type { Url } from '@tinkoff/url';
import type { NavigateOptions, NavigationHook, NavigationSyncHook, NavigationGuard } from './types';

export const isFilePath = (pathname: string) => {
  return /\/.+\.[^/]+$/.test(pathname);
};

export const normalizeTrailingSlash = (pathname: string, trailingSlash = false) => {
  const hasTrailingSlash = pathname.endsWith('/');

  if (trailingSlash) {
    return hasTrailingSlash || isFilePath(pathname) ? pathname : `${pathname}/`;
  }

  return pathname.length > 1 && hasTrailingSlash ? pathname.slice(0, -1) : pathname;
};

export const normalizeManySlashes = (hrefOrPath: string) => {
  const [href, ...search] = hrefOrPath.split('?');

  return [href.replace(/\/+/g, '/').replace(/^(\w+):\//, '$1://'), ...search].join('?');
};

export const isSameHost =
  typeof window === 'undefined'
    ? T
    : (url: Url) => {
        return !url.host || url.host === window.location.host;
      };

export const makeNavigateOptions = (options: string | NavigateOptions): NavigateOptions => {
  if (typeof options === 'string') {
    return { url: options };
  }

  return options;
};

export const registerHook = <T extends NavigationHook | NavigationSyncHook | NavigationGuard>(
  hooksSet: Set<T>,
  hook: T
) => {
  hooksSet.add(hook);

  return () => {
    hooksSet.delete(hook);
  };
};
