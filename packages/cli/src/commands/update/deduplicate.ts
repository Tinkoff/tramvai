import ora from 'ora';
import util from 'util';
import childProcess from 'child_process';
import { npmRequire } from '../../utils/npmRequire';
import { CLI_PACKAGE_MANAGER } from '../../di/tokens';
import type { Context } from '../../models/context';

const exec = util.promisify(childProcess.exec);

export const deduplicate = async (context: Context) => {
  const spinner = ora('Deduplicate dependencies in a lock file').start();

  try {
    await context.packageManager.dedupe();
    spinner.stop();
    console.log('Completed');
  } catch (e) {
    spinner.stop();
    console.error('Deduplication error: ', e);
    throw e;
  }
};
