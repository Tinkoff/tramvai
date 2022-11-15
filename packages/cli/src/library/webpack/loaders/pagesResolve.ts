import path from 'path';
import readDir from 'fs-readdir-recursive';
import fs from 'fs';

const LAYOUT_FILENAME = '_layout.tsx';

export default function () {
  const { fileSystemPages, rootDir, root, extensions } = this.getOptions();
  const fsLayouts = [];

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
          const layoutPath = path.join(path.dirname(pageComponentPath), LAYOUT_FILENAME);

          if (fs.existsSync(layoutPath)) {
            // @example '@/pages/MainPage': lazy(() => import(/* webpackChunkName: "@_pages_MainPage_layout" */ '/tramvai-app/src/pages/MainPage_layout'))
            fsLayouts.push(
              `'${pageComponentName}': lazy(() => import(/* webpackChunkName: "${pageComponentChunkName}__layout" */ '${layoutPath.replace(
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
}`;

  return code;
}
