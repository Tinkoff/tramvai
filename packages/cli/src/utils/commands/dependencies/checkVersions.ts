import ora from 'ora';
import util from 'util';
import childProcess from 'child_process';
import type { Context } from '../../../models/context';

const exec = util.promisify(childProcess.exec);

export const checkVersions = async (context: Context) => {
  const spinner = ora('Check tramvai versions').start();

  try {
    await exec(`npx tramvai-check-versions`);
    spinner.stop();
    console.log('Versions check completed');
  } catch (e) {
    spinner.stop();
    console.error('Versions check error: ', e);
    throw e;
  }
};
