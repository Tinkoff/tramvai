import util from 'util';
import childProcess from 'child_process';
import type { Context } from '../../models/context';
import { isLockfileChanged } from '../../utils/lockfileHash';

const exec = util.promisify(childProcess.exec);

export const runMigrationsAndCheckVersions = async (context: Context) => {
  if (isLockfileChanged(context)) {
    const { stdout: migrateLog } = await exec(`npx tramvai-migrate`);
    console.log(migrateLog);
    const { stdout: checkLog } = await exec(`npx tramvai-check-versions`);
    console.log(checkLog);
  }

  return { name: 'runMigrationsAndCheckVersions', status: 'ok' };
};
