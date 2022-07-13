import { join, resolve } from 'path';
import { readdirSync, existsSync } from 'fs';

import { command } from 'execa';
import type { DirectoryTree } from 'directory-tree';
import dirTree from 'directory-tree';
import rimraf from 'rimraf';

const bin = join(__dirname, '../bin/platform.js');
const examplesRoot = join(__dirname, '../../../tinkoff-examples');
const examplesList = ['module', 'package', 'react-app'];

const normalizePath = (pth: string) => pth.replace(/\\/g, '/');

const sortByPath = (items: DirectoryTree[]) => {
  return items.sort((a, b) => a.path.localeCompare(b.path));
};

const getTrees = (dir: string) => {
  const trees: { original: DirectoryTree[]; less: DirectoryTree[] } = {
    original: [],
    less: [],
  };

  // определяем, как именно собирали файлы, что бы иметь возможность вырезать хэши
  const isWebpackBuild = existsSync(join(dir, 'client', 'stats.json'));

  dirTree(dir, {}, (item) => {
    const { path, name } = item;

    const newPath = path.split('.');
    const newName = name.split('.');

    if (isWebpackBuild) {
      newPath.splice(1, 1);
      newName.splice(1, 1);
    }

    trees.original.push(item);

    const newOne = {
      ...item,
      path: normalizePath(newPath.join('.')),
      name: normalizePath(newName.join('.')),
    };

    // Might differ on different systems or runs for some reason
    // @ts-ignore
    delete newOne.size;

    trees.less.push(newOne);
  });

  return {
    original: sortByPath(trees.original),
    less: sortByPath(trees.less),
  };
};

describe('enmasse', () => {
  const currentCwd = process.cwd();
  const currentProcessEnv = process.env;

  readdirSync(examplesRoot)
    .filter((path) => examplesList.includes(path))
    .forEach((file) => {
      const app = file;

      // eslint-disable-next-line jest/valid-describe
      describe(`test ${app}`, () => {
        beforeAll(() => {
          const appCwd = join(examplesRoot, app);

          process.chdir(appCwd);

          rimraf.sync(resolve(appCwd, 'dist'));

          // На MacOS chulk генерирует дополнительные символы в снапшот тестах,
          // принудительно отключаем colorized output https://github.com/chalk/supports-color#info
          process.env = { ...process.env, FORCE_COLOR: '0' };
        });

        afterAll(() => {
          process.chdir(currentCwd);
          process.env = currentProcessEnv;
        });

        it(`platform --help ${app}`, async () => {
          const result = await command(`node ${bin} --no-color --help`, { shell: true });

          expect(result.exitCode).toEqual(0);
          expect(result.stdout).toMatchSnapshot();
        });

        it(`platform build ${app}`, async () => {
          const result = await command(`node ${bin} build ${app}`, { shell: true }).catch(
            (error) => {
              console.error(error.stderr);
              console.info(error.stdout);
              throw error;
            }
          );

          const output = getTrees('dist');

          expect(result.exitCode).toEqual(0);

          expect(output.less).toMatchSnapshot();

          output.original.forEach((f) => {
            expect(f.size).toBeGreaterThan(0);
          });
        }, 120000);
      });
    });
});
