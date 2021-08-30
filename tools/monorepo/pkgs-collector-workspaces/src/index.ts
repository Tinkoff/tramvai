import glob from 'glob';
import path from 'path';
import type { CollectorInterface } from '@tinkoff-monorepo/pkgs-collector';

export const Collector: CollectorInterface = {
  name: '@tinkoff-monorepo/pkgs-collector-workspaces',

  async collect() {
    const rootPkgJson = require(path.resolve('package.json'));

    const pkgDirs = Array.isArray(rootPkgJson.workspaces)
      ? (rootPkgJson.workspaces as string[])
      : (rootPkgJson.workspaces?.packages as string[]);

    if (!pkgDirs) {
      throw new Error('No workspaces in package.json found! Consider using different collector');
    }

    const pkgs = pkgDirs
      .reduce((acc: string[], dirPattern) => {
        return acc.concat(
          glob.sync(dirPattern.endsWith('/') ? dirPattern : `${dirPattern}/`, {
            ignore: ['**/node_modules/**'],
            absolute: true,
          })
        );
      }, [])
      .reduce((files: string[], dir) => {
        return files.concat(
          glob.sync('package.json', {
            cwd: dir,
            absolute: true,
          })
        );
      }, [])
      .map((pkgJsonPath) => {
        const pkgJson = require(pkgJsonPath);
        const absPath = path.dirname(pkgJsonPath);
        return {
          path: path.relative(process.cwd(), absPath),
          absPath,
          manifestPath: pkgJsonPath,
          name: pkgJson.name,
          meta: pkgJson,
        };
      });

    if (!pkgs.length) {
      throw new Error(`No packages found in workspaces:\n${pkgDirs.join('\n')}\n`);
    }

    return {
      allPkgs: pkgs,
      affectedPkgs: pkgs,
    };
  },
};
