import path from 'path';
import readDir from 'fs-readdir-recursive';
import fs from 'fs';
import type { LoaderDefinitionFunction } from 'webpack';
import type { ApplicationConfigEntry } from '../../../api';

const LAYOUT_FILENAME = '_layout.tsx';
const ERROR_BOUNDARY_FILENAME = '_error.tsx';
const WILDCARD_FILENAME = '*.tsx';

interface Options {
  rootDir: string;
  root: string;
  extensions: string[];
  fileSystemPages: ApplicationConfigEntry['fileSystemPages'];
}

const removeExtension = (filename: string): string => {
  const parsed = path.parse(filename);

  return path.join(parsed.dir, parsed.name);
};

// eslint-disable-next-line func-style
const pagesResolve: LoaderDefinitionFunction<Options> = function () {
  const { fileSystemPages, rootDir, root, extensions } = this.getOptions();
  const fsLayouts: string[] = [];
  const fsErrorBoundaries: string[] = [];
  const fsWildcards: string[] = [];

  this.cacheable(false);

  // eslint-disable-next-line max-statements
  const filesToPages = ({
    pagesRootDirectory,
    isRoutes = false,
  }: {
    pagesRootDirectory: string;
    isRoutes?: boolean;
  }) => {
    const pagesDir = path.resolve(rootDir, root, pagesRootDirectory);

    this.addContextDependency(pagesDir);

    // skip files whose name starts with dot, asterisk or underscore symbols
    const pagesFiles = readDir(
      pagesDir,
      (name: string) => name[0] !== '.' && name[0] !== '*' && name[0] !== '_'
    );
    const fsPages = [];

    for (const file of pagesFiles) {
      const extname = path.extname(file);
      const name = file.replace(new RegExp(`\\${extname}$`), '').replace(/\\/g, '/');

      if (extensions.indexOf(extname) !== -1) {
        const pageComponentName = `@/${pagesRootDirectory}/${name}`;
        const pageComponentPath = path.resolve(pagesDir, name).replace(/\\/g, '\\\\');
        const chunkname = pageComponentName.replace(/\//g, '_');

        // @example '@/pages/MainPage': lazy(() => import(/* webpackChunkName: "@_pages_MainPage" */ '/tramvai-app/src/pages/MainPage'))
        fsPages.push(
          `'${pageComponentName}': lazy(() => import(/* webpackChunkName: "${chunkname}" */ '${pageComponentPath}'))`
        );

        if (isRoutes) {
          const pageDirname = path.dirname(pageComponentPath);

          const layoutPath = path.join(pageDirname, LAYOUT_FILENAME);
          const errorBoundaryPath = path.join(pageDirname, ERROR_BOUNDARY_FILENAME);
          const wildcardPath = path.join(pageDirname, WILDCARD_FILENAME);

          if (fs.existsSync(layoutPath)) {
            const filename = removeExtension(layoutPath);
            // @example '@/pages/MainPage': lazy(() => import(/* webpackChunkName: "@_pages_MainPage__layout" */ '/tramvai-app/src/pages/MainPage_layout'))
            fsLayouts.push(
              `'${pageComponentName}': lazy(() => import(/* webpackChunkName: "${chunkname}__layout" */ '${filename}'))`
            );
          }

          if (fs.existsSync(errorBoundaryPath)) {
            const filename = removeExtension(errorBoundaryPath);

            // @example '@/pages/MainPage': lazy(() => import(/* webpackChunkName: "@_pages_MainPage__errorBoundary" */ '/tramvai-app/src/pages/MainPage_errorBoundary'))
            fsErrorBoundaries.push(
              `'${pageComponentName}': lazy(() => import(/* webpackChunkName: "${chunkname}__errorBoundary" */ '${filename}'))`
            );
          }

          if (fs.existsSync(wildcardPath)) {
            const componentName = `${pageComponentName}__wildcard`;
            const filename = removeExtension(wildcardPath);

            // @example '@/pages/MainPage': lazy(() => import(/* webpackChunkName: "@_pages_MainPage__wildcard" */ '/tramvai-app/src/pages/MainPage_wildcard'))
            fsWildcards.push(
              `'${componentName}': lazy(() => import(/* webpackChunkName: "${chunkname}__wildcard" */ '${filename}'))`
            );
          }
        }
      }
    }

    return fsPages;
  };

  const fsRoutes = fileSystemPages.routesDir
    ? filesToPages({
        pagesRootDirectory: fileSystemPages.routesDir,
        isRoutes: true,
      })
    : [];
  const fsPages = fileSystemPages.pagesDir
    ? filesToPages({
        pagesRootDirectory: fileSystemPages.pagesDir,
      })
    : [];

  const code = `import { lazy } from '@tramvai/react';

  export default {
    routes: {
      ${fsRoutes.join(',\n')}
    },
    pages: {
      ${fsPages.join(',\n')}
    },
    layouts: {
      ${fsLayouts.join(',\n')}
    },
    errorBoundaries: {
      ${fsErrorBoundaries.join(',\n')}
    },
    wildcards: {
      ${fsWildcards.join(',\n')}
    },
  }`;

  return code;
};

export default pagesResolve;
