import pathOr from '@tinkoff/utils/object/pathOr';
import pathSet from '@tinkoff/utils/object/pathSet';

import { resolve } from 'path';
import glob from 'fast-glob';
import { readJSON, ensureFile, writeJSON } from 'fs-extra';
import envCi from 'env-ci';
import { logger } from '@tinkoff/logger';
import type { AppliedInfo, Api } from './types';
import { createApi, getTramvaiJSONPath } from './api';
import { TRAMVAI_BASE_PATH, APPLIED_FILENAME, TRAMVAI_TINKOFF_BASE_PATH } from './constants';

const getPackageName = (filename: string) => {
  return filename.replace(/^node_modules\//, '').split('/')[1];
};

const ciInfo = envCi();
const cwd = process.env.INIT_CWD || process.cwd();

const log = logger('tramvai-migrate');

logger.enable('tramvai-migrate');

// eslint-disable-next-line max-statements
(async () => {
  const { name: cwdPackageName } = await readJSON(resolve(cwd, 'package.json')).catch(() => ({}));
  const tramvaiJSONPath = await getTramvaiJSONPath(cwd);

  // ignore the migration check in the tramvai repository,
  // or is absent `tramvai.json`,
  // or if the environment variable is set,
  // or we do the installation inside the CI,
  if (
    cwdPackageName === 'tramvai' ||
    !tramvaiJSONPath ||
    process.env.SKIP_TRAMVAI_MIGRATIONS ||
    ciInfo.isCi
  ) {
    return;
  }

  log.info('Checking migrations');
  const files = await glob(
    [
      `${TRAMVAI_BASE_PATH}*/__migrations__/*.js`,
      `${TRAMVAI_TINKOFF_BASE_PATH}*/__migrations__/*.js`,
    ],
    {
      cwd,
      objectMode: true,
      ignore: ['**/*.spec.js'],
    }
  );

  if (!files.length) {
    log.info('Migrations are not found. The migration process is completed');
    return;
  }

  log.debug('Migrations found');

  const appliedFilename = resolve(cwd, APPLIED_FILENAME);
  await ensureFile(appliedFilename);

  let appliedInfo: AppliedInfo = await readJSON(appliedFilename).catch(() => ({}));
  let api: Api;
  let save: () => {};

  log.info('Starting to perform migrations');

  for (const fileInfo of files) {
    const packageName = getPackageName(fileInfo.path);
    const migrationPath = [
      /@tramvai-tinkoff/.test(fileInfo.path) ? 'tinkoff-package' : 'package',
      packageName,
      'migrations',
    ];
    const appliedMigrations: string[] = pathOr(migrationPath, [], appliedInfo);

    if (!appliedMigrations.includes(fileInfo.name)) {
      log.info(`Running migration '${fileInfo.name}' from module '${packageName}'`);
      if (!api) {
        // eslint-disable-next-line no-await-in-loop
        ({ api, save } = await createApi(cwd));
      }

      const migration = require(resolve(cwd, fileInfo.path));

      try {
        // eslint-disable-next-line no-await-in-loop
        await migration(api);

        appliedMigrations.push(fileInfo.name);
        appliedInfo = pathSet(migrationPath, appliedMigrations, appliedInfo);
      } catch (error) {
        log.error(error, `Migration error '${fileInfo.name}' from module '${packageName}'`);
      }
    }
  }

  log.info('All migrations are completed, save the information about the completed migrations');

  await save?.();
  await writeJSON(appliedFilename, appliedInfo);

  log.info('Migrations successfully completed');
})();

export * from './types';
