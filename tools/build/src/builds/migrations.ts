import glob from 'fast-glob';
import rollupExternalModules from 'rollup-external-modules';
import jsonPlugin from '@rollup/plugin-json';
import typescriptPlugin from '@rollup/plugin-typescript';
import type { Build } from './build.h';
import { mergeFiles } from '../packageJson';

export const createBuild = (): Build => {
  let migrations: string[] = null;

  const getMigrations = async () => {
    if (!migrations) {
      migrations =
        (await glob(`migrations/*.{js,ts}`, {
          ignore: ['**/*.spec.{js,ts}'],
        })) || [];
    }
    return migrations;
  };

  return {
    name: 'migrations',
    async shouldExecute() {
      const entries = await getMigrations();
      return entries.length > 0;
    },
    async getOptions() {
      const entries = await getMigrations();

      return {
        input: {
          input: entries,
          external: rollupExternalModules,
          plugins: [
            jsonPlugin(),
            typescriptPlugin({
              module: 'esnext',
              target: 'es5',
              tsconfig: false,
              include: ['migrations/**/*'],
              experimentalDecorators: true,
              declaration: false,
            }),
          ],
        },
        output: {
          dir: '__migrations__',
          format: 'cjs',
          exports: 'default',
        },
      };
    },
    async modifyPackageJSON({ packageJSON }) {
      return {
        ...packageJSON,
        files: mergeFiles(packageJSON, ['__migrations__']),
      };
    },
  };
};
