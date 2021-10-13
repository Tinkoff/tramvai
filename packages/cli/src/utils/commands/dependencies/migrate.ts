import ora from 'ora';
import util from 'util';
import childProcess from 'child_process';
import type { Context } from '../../../models/context';

const exec = util.promisify(childProcess.exec);

export const migrate = async (context: Context) => {
  const spinner = ora('Migrations start').start();

  try {
    await exec(`npx tramvai-migrate`);
    spinner.stop();
    console.log('Migrations completed');
  } catch (e) {
    spinner.stop();
    console.error('Migrations error: ', e);
    throw e;
  }
};
