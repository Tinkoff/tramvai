import path from 'path';
import readDir from 'fs-readdir-recursive';
import fs from 'fs';
import type { LoaderDefinitionFunction } from 'webpack';
import type { ApplicationConfigEntry } from '../../../api';

const LAYOUT_FILENAME = '_layout.tsx';
const ERROR_BOUNDARY_FILENAME = '_error.tsx';
const WILDCARD_TOKEN = '[...';

export interface PagesResolveOptions {
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
const pagesResolve: LoaderDefinitionFunction<PagesResolveOptions> = function () {
  const { fileSystemPages, rootDir, root, extensions } = this.getOptions();
  const extensionsRegexp = new RegExp(`\\.(${extensions.map((ext) => ext.slice(1)).join('|')})$`);
  const fsLayouts: string[] = [];
  const fsErrorBoundaries: string[] = [];
  const fsWildcards: string[] = [];

  this.cacheable(false);

  // eslint-disable-next-line max-statements
  const filesToPages = ({
    pagesRootDirectory,
    isRoutes = false,
    test,
  }: {
    pagesRootDirectory: string;
    isRoutes?: boolean;
    test: RegExp;
  }) => {
    const pagesDir = path.resolve(rootDir, root, pagesRootDirectory);

    this.addContextDependency(pagesDir);

    // skip service files
    const pagesFiles = readDir(
      pagesDir,
      (name: string) => name[0] !== '.' && name[0] !== '_' && !name.startsWith(WILDCARD_TOKEN)
    );
    const fsPages = [];

    for (const file of pagesFiles) {
      const extname = path.extname(file);
      const normalizedFile = file.replace(/\\/g, '/');

      if (test.test(normalizedFile)) {
        const name = normalizedFile.replace(new RegExp(`\\${extname}$`), '');
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

          const routeContent = fs
            .readdirSync(pageDirname, { withFileTypes: true })
            .filter((item) => item.isFile())
            .map((item) => item.name);
          const wildcardPath = routeContent.find((item) => item.includes(WILDCARD_TOKEN));

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

          if (wildcardPath !== undefined) {
            const componentName = `${pageComponentName}__wildcard`;
            const filename = removeExtension(path.join(pageDirname, wildcardPath));

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
        test: new RegExp(`index${extensionsRegexp.source}`),
      })
    : [];
  const fsPages = fileSystemPages.pagesDir
    ? filesToPages({
        pagesRootDirectory: fileSystemPages.pagesDir,
        test: fileSystemPages.componentsPattern
          ? new RegExp(fileSystemPages.componentsPattern)
          : extensionsRegexp,
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
