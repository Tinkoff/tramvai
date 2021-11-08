import ora from 'ora';
import type { Context } from '../../../models/context';

export const installDependencies = async (context: Context) => {
  const spinner = ora('Install dependencies...').start();

  try {
    await context.packageManager.install();
    spinner.stop();
    console.log('Dependencies installed');
  } catch (e) {
    spinner.stop();
    console.error('Error installing dependencies:');
    throw e;
  }
};
