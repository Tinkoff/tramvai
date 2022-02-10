import util from 'util';
import childProcess from 'child_process';
import { isLockfileChanged } from '../../utils/lockfileHash';
import type { Validator } from './validator.h';

const exec = util.promisify(childProcess.exec);

export const runMigrationsAndCheckVersions: Validator = async (context) => {
  if (isLockfileChanged(context)) {
    const { stdout: migrateLog } = await exec(`npx tramvai-migrate`);
    console.log(migrateLog);
    const { stdout: checkLog } = await exec(`npx tramvai-check-versions`);
    console.log(checkLog);
  }

  return { name: 'runMigrationsAndCheckVersions', status: 'ok' };
};
