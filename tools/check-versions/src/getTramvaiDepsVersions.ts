import { resolve } from 'path';
import { readJSON } from 'fs-extra';
import type { SemVer } from 'semver';
import { parse } from 'semver';
import pMap from 'p-map';
import { isTramvai } from './isTramvai';

const CONCURRENCY = 10;

export const getTramvaiDepsVersions = async (): Promise<Map<string, SemVer>> => {
  const cwd = process.env.INIT_CWD || process.cwd();
  const depsVersions = new Map<string, SemVer>();

  const { dependencies = {} } = await readJSON(resolve(cwd, 'package.json')).catch(() => ({}));

  await pMap(
    Object.keys(dependencies),
    async (name) => {
      if (isTramvai(name)) {
        const { version } = await readJSON(
          resolve(cwd, 'node_modules', name, 'package.json')
        ).catch(() => null);

        if (version) {
          depsVersions.set(name, parse(version));
        }
      }
    },
    { concurrency: CONCURRENCY }
  );

  return depsVersions;
};
