import type { Route } from '@tinkoff/router';
import { getParts } from '@tinkoff/router';
import fsPagesAndComponents from '@tramvai/cli/lib/external/pages';

export const FILE_SYSTEM_PAGES_PREFIX = '@/';

export const fileSystemPagesEnabled = (): boolean =>
  !!process.env.__TRAMVAI_EXPERIMENTAL_ENABLE_FILE_SYSTEM_PAGES;

export const getStaticFileSystemPages = () => {
  return fsPagesAndComponents.staticPages;
};

export const getExternalFileSystemPages = () => {
  return fsPagesAndComponents.externalPages;
};

export const getAllFileSystemPages = () => {
  return { ...fsPagesAndComponents.staticPages, ...fsPagesAndComponents.externalPages };
};

export const isFileSystemPageComponent = (pageComponent: string): boolean => {
  return (
    fileSystemPagesEnabled() &&
    !!pageComponent &&
    pageComponent.indexOf(FILE_SYSTEM_PAGES_PREFIX) === 0
  );
};

/**
 * @example
 * @/pages/index to /
 * @/pages/foo/bar/[id]/index to /foo/bar/:id/
 */
export const staticFileSystemPageToPath = (pageComponent: string): string => {
  return `/${pageComponent
    .replace(
      `${FILE_SYSTEM_PAGES_PREFIX}${process.env.__TRAMVAI_EXPERIMENTAL_STATIC_PAGES_DIR}/`,
      ''
    )
    .replace(/\[(.+)\]/g, ':$1')
    .replace(/index$/g, '')}`;
};

/**
 * @example
 * / to @/pages/index
 * /sub/route/:id to @/pages/sub/route/[id]
 */
export const pathToExternalFileSystemPage = (path: string): string => {
  const urlParts = getParts(path);

  const pageComponentParts = urlParts.map((part) => {
    // @example :id to [id]
    if (part.startsWith(':')) {
      return `[${part.replace(':', '')}]`;
    }
    return part;
  });

  return [
    `${FILE_SYSTEM_PAGES_PREFIX}${process.env.__TRAMVAI_EXPERIMENTAL_EXTERNAL_PAGES_DIR}`,
    ...pageComponentParts,
    'index',
  ]
    .filter(Boolean)
    .join('/');
};

export const fileSystemPageToRoute = (pageComponent: string): Route => {
  const name = pageComponent;
  const path = staticFileSystemPageToPath(pageComponent);

  return {
    name,
    path,
    config: {
      pageComponent,
    },
  };
};

export const fileSystemPageComponentExists = (pageComponent: string): boolean => {
  return !!(
    getStaticFileSystemPages()[pageComponent] || getExternalFileSystemPages()[pageComponent]
  );
};
