import nothing from '@tinkoff/utils/function/nothing';
import noop from '@tinkoff/utils/function/noop';
import eachObj from '@tinkoff/utils/object/each';

import { cpus } from 'os';
import { resolve } from 'path';
import { readJSON, writeJSON, readFile, writeFile, pathExists, remove } from 'fs-extra';
import glob from 'fast-glob';
import PQueue from 'promise-queue';
import type { API as JsCodeShiftApi, FileInfo } from 'jscodeshift';
import { withParser } from 'jscodeshift';
import { logger } from '@tinkoff/logger';
import type { Api } from './types';
import { TRAMVAI_JSON_PATHS, PRINT_OPTIONS } from './constants';

const log = logger('tramvai-migrate');

type ExtendedFileInfo = Record<string, FileInfo & { originSource?: string; originPath?: string }>;

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

export const createApi = async (cwd: string) => {
  const packageJSONPath = resolve(cwd, 'package.json');
  const tramvaiJSONPath = await getTramvaiJSONPath(cwd);
  const packageJSONSource = await readJSON(packageJSONPath).catch(nothing);
  const tramvaiJSONSource = await readJSON(tramvaiJSONPath).catch(nothing);

  const packageJSON = {
    source: packageJSONSource,
    path: packageJSONPath,
    originPath: packageJSONPath,
  };
  const tramvaiJSON = {
    source: tramvaiJSONSource,
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
  const filesInfo: ExtendedFileInfo = {};
  const jsonFilesInfo: ExtendedFileInfo = {};
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
          log.error(error, `Ошибка при выполнении миграции для файла ${fileInfo.path}`);
        }
      }
    },
  };

  const save = async () => {
    const pq = new PQueue(cpus());
    const promises = [];

    jsonFilesInfo['package.json'] = packageJSON;
    jsonFilesInfo['tramvai.json'] = tramvaiJSON;

    eachObj((fileInfo) => {
      promises.push(pq.add(() => writeJSON(fileInfo.path, fileInfo.source, { spaces: 2 })));

      if (fileInfo.path !== fileInfo.originPath) {
        promises.push(pq.add(() => remove(fileInfo.originPath)));
      }
    }, jsonFilesInfo);

    eachObj((fileInfo) => {
      if (fileInfo.source !== fileInfo.originSource) {
        promises.push(pq.add(() => writeFile(fileInfo.path, fileInfo.source)));

        if (fileInfo.path !== fileInfo.originPath) {
          promises.push(pq.add(() => remove(fileInfo.originPath)));
        }
      }
    }, filesInfo);

    return Promise.all(promises);
  };

  return { api, save };
};
