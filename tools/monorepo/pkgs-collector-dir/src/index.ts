import glob from 'glob';
import path from 'path';
import type { CollectorInterface } from '@tinkoff-monorepo/pkgs-collector';

export const Collector: CollectorInterface = {
  name: '@tinkoff-monorepo/pkgs-collector-dir',

  cliOpts: [
    {
      name: 'pkgDirs',
      type: 'array' as const,
      required: true,
      description: 'Список директорий в которых искать пакеты',
    },
  ],

  async collect(collectorConfig: { pkgDirs: string[] }) {
    const { pkgDirs } = collectorConfig;

    const pkgs = pkgDirs
      .reduce((acc: string[], dirPattern) => {
        const dirs = glob.sync(dirPattern, {
          absolute: true,
        });
        return dirs.reduce((files: string[], dir) => {
          return files.concat(
            glob.sync('package.json', {
              cwd: dir,
              absolute: true,
            })
          );
        }, []);
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
      throw new Error(`No packages found for given patterns:\n${pkgDirs.join('\n')}\n`);
    }

    return {
      allPkgs: pkgs,
      affectedPkgs: pkgs,
    };
  },
};
