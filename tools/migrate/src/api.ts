import nothing from '@tinkoff/utils/function/nothing';
import noop from '@tinkoff/utils/function/noop';
import isEqual from '@tinkoff/utils/is/equal';
import clone from '@tinkoff/utils/clone';

import { cpus } from 'os';
import { resolve } from 'path';
import { readJSON, writeJSON, readFile, writeFile, pathExists, remove } from 'fs-extra';
import glob from 'fast-glob';
import pMap from 'p-map';
import type { API as JsCodeShiftApi } from 'jscodeshift';
import { withParser } from 'jscodeshift';
import { logger } from '@tinkoff/logger';
import { resolvePackageManager } from '@tinkoff/package-manager-wrapper';
import type {
  Api,
  FileInfo,
  JsonFilesInfo,
  PackageJSON,
  SourceFilesInfo,
  TramvaiJSON,
} from './types';
import { TRAMVAI_JSON_PATHS, PRINT_OPTIONS } from './constants';
import { register } from './transform';

register();

const log = logger('tramvai-migrate');

export const getTramvaiJSONPath = async (cwd: string) => {
  for (const path of TRAMVAI_JSON_PATHS) {
    const resolvedPath = resolve(cwd, path);
    // eslint-disable-next-line no-await-in-loop
    if (await pathExists(resolvedPath)) {
      return resolvedPath;
    }
  }
};

export const createJsCodeShiftApi = (): JsCodeShiftApi => {
  const jscodeshift = withParser('tsx');

  return {
    jscodeshift,
    j: jscodeshift,
    stats: noop,
    report: noop,
  };
};

const createFileInfo = async (cwd: string, filepath: string) => {
  const path = resolve(cwd, filepath);
  const source = await readFile(path, 'utf-8');

  return {
    path,
    originPath: path,
    source,
    originSource: source,
  };
};

const saveFileChanges = async <T>(
  fileInfo: FileInfo<T>,
  write: (fileInfo: FileInfo<T>) => Promise<void>
) => {
  if (!isEqual(fileInfo.source, fileInfo.originSource)) {
    await write(fileInfo);

    if (fileInfo.path !== fileInfo.originPath) {
      await remove(fileInfo.originPath);
    }
  }
};

const hasDepsChanges = (packageJson: FileInfo<PackageJSON>) => {
  const { source, originSource } = packageJson;

  return (
    !isEqual(source.dependencies, originSource.dependencies) ||
    !isEqual(source.devDependencies, originSource.devDependencies)
  );
};

export const createApi = async (cwd: string) => {
  const packageJSONPath = resolve(cwd, 'package.json');
  const tramvaiJSONPath = await getTramvaiJSONPath(cwd);
  const packageJSONSource = await readJSON(packageJSONPath).catch(nothing);
  const tramvaiJSONSource = await readJSON(tramvaiJSONPath).catch(nothing);

  const packageJSON: FileInfo<PackageJSON> = {
    source: packageJSONSource,
    originSource: clone(packageJSONSource),
    path: packageJSONPath,
    originPath: packageJSONPath,
  };
  const tramvaiJSON: FileInfo<TramvaiJSON> = {
    source: tramvaiJSONSource,
    originSource: clone(tramvaiJSONSource),
    path: tramvaiJSONPath,
    originPath: tramvaiJSONPath,
  };

  const migrationsOptions = tramvaiJSON.source?.migrations ?? {};
  const srcGlob = migrationsOptions.sourcePattern ?? ['**/*.{js,ts,jsx,tsx}'];
  const ignorePattern = (migrationsOptions.ignorePattern ?? []).concat(
    '**/node_modules/**',
    '**/dist/**',
    '**/lib/**',
    '**/compiled/**',
    '**/.storybook/**',
    '**/.tmp/**',
    '**/.cache/**'
  );

  log.debug('sourcePattern:', srcGlob);
  log.debug('ignorePattern:', ignorePattern);

  const files = await glob(srcGlob, {
    cwd,
    ignore: ignorePattern,
  });
  const filesInfo: SourceFilesInfo = {};
  const jsonFilesInfo: JsonFilesInfo = {};
  const codeShiftApi = createJsCodeShiftApi();

  const api: Api = {
    packageJSON,
    tramvaiJSON,
    transform: async (transformer, pathTransformer) => {
      for (const filename of files) {
        // eslint-disable-next-line no-await-in-loop
        const fileInfo = filesInfo[filename] ?? (await createFileInfo(cwd, filename));

        try {
          const transformedSource = transformer(fileInfo, codeShiftApi, {
            printOptions: PRINT_OPTIONS,
          });
          const transformedPath = pathTransformer?.(fileInfo);

          filesInfo[filename] = {
            ...fileInfo,
            path: transformedPath || fileInfo.path,
            source: transformedSource || fileInfo.source,
          };
        } catch (error) {
          log.error(error, `Migration error for file ${fileInfo.path}`);
        }
      }
    },
  };

  const save = async () => {
    jsonFilesInfo['package.json'] = packageJSON;
    jsonFilesInfo['tramvai.json'] = tramvaiJSON;

    await Promise.all([
      pMap(Object.values(jsonFilesInfo), (fileInfo) =>
        saveFileChanges(fileInfo, ({ path, source }) => writeJSON(path, source, { spaces: 2 }))
      ),
      pMap(
        Object.values(filesInfo),
        (fileInfo) => saveFileChanges(fileInfo, ({ path, source }) => writeFile(path, source)),
        { concurrency: cpus().length }
      ),
    ]);

    if (hasDepsChanges(packageJSON)) {
      log.warn('Dependency has changed - run packages install');

      const packageManager = resolvePackageManager({ rootDir: cwd });

      await packageManager.install();
    }
  };

  return { api, save };
};
