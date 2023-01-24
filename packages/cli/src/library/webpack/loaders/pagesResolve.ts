import path from 'path';
import readDir from 'fs-readdir-recursive';
import fs from 'fs';

const LAYOUT_FILENAME = '_layout.tsx';
const ERROR_BOUNDARY_FILENAME = '_error.tsx';

export default function () {
  const { fileSystemPages, rootDir, root, extensions } = this.getOptions();
  const fsLayouts = [];
  const fsErrorBoundaries = [];

  this.cacheable(false);

  const filesToPages = ({
    pagesRootDirectory,
    isRoutes = false,
  }: {
    pagesRootDirectory: string;
    isRoutes?: boolean;
  }) => {
    const pagesDir = path.resolve(rootDir, root, pagesRootDirectory);

    this.addContextDependency(pagesDir);

    // skip files whose name starts with dot or underscore symbols
    const pagesFiles = readDir(pagesDir, (name) => name[0] !== '.' && name[0] !== '_');
    const fsPages = [];

    for (const file of pagesFiles) {
      const extname = path.extname(file);
      const name = file.replace(new RegExp(`\\${extname}$`), '').replace(/\\/g, '/');

      if (extensions.indexOf(extname) !== -1) {
        const pageComponentName = `@/${pagesRootDirectory}/${name}`;
        const pageComponentPath = path.resolve(pagesDir, name).replace(/\\/g, '\\\\');
        const pageComponentChunkName = pageComponentName.replace(/\//g, '_');

        // @example '@/pages/MainPage': lazy(() => import(/* webpackChunkName: "@_pages_MainPage" */ '/tramvai-app/src/pages/MainPage'))
        fsPages.push(
          `'${pageComponentName}': lazy(() => import(/* webpackChunkName: "${pageComponentChunkName}" */ '${pageComponentPath}'))`
        );

        if (isRoutes) {
          const pageDirname = path.dirname(pageComponentPath);

          const layoutPath = path.join(pageDirname, LAYOUT_FILENAME);
          const errorBoundaryPath = path.join(pageDirname, ERROR_BOUNDARY_FILENAME);

          if (fs.existsSync(layoutPath)) {
            // @example '@/pages/MainPage': lazy(() => import(/* webpackChunkName: "@_pages_MainPage__layout" */ '/tramvai-app/src/pages/MainPage_layout'))
            fsLayouts.push(
              `'${pageComponentName}': lazy(() => import(/* webpackChunkName: "${pageComponentChunkName}__layout" */ '${layoutPath.replace(
                '.tsx',
                ''
              )}'))`
            );
          }

          if (fs.existsSync(errorBoundaryPath)) {
            // @example '@/pages/MainPage': lazy(() => import(/* webpackChunkName: "@_pages_MainPage__errorBoundary" */ '/tramvai-app/src/pages/MainPage_errorBoundary'))
            fsErrorBoundaries.push(
              `'${pageComponentName}': lazy(() => import(/* webpackChunkName: "${pageComponentChunkName}__errorBoundary" */ '${errorBoundaryPath.replace(
                '.tsx',
                ''
              )}'))`
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
  }`;

  return code;
}
