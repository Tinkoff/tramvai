import ora from 'ora';
import util from 'util';
import childProcess from 'child_process';
import type { Context } from '../../models/context';

const exec = util.promisify(childProcess.exec);

export const installDependencies = async (context: Context) => {
  const spinner = ora('Install dependencies...').start();

  try {
    await context.packageManager.install();
    spinner.stop();
    console.log('Dependencies installed');
  } catch (e) {
    spinner.stop();
    console.error('Error installing dependencies: ', e);
    throw e;
  }
};
