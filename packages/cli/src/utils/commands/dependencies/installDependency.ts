import ora from 'ora';
import type { Context } from '../../../models/context';

export const installDependency = async (
  { name, version, devDependency }: { name: string; version: string; devDependency?: boolean },
  context: Context
) => {
  const spinner = ora(`Install ${name}@${version}`).start();

  try {
    await context.packageManager.install({ name, version, devDependency });
    spinner.stop();
    console.log(`${name}@${version} installed`);
  } catch (e) {
    spinner.stop();
    console.error(`Error installing ${name}@${version}: `, e);
    throw e;
  }
};
