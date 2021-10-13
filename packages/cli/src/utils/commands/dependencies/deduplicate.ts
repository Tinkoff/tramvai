import ora from 'ora';
import type { Context } from '../../../models/context';

export const deduplicate = async (context: Context) => {
  const spinner = ora('Deduplicate dependencies in a lock file').start();

  try {
    await context.packageManager.dedupe();
    spinner.stop();
    console.log('Deduplication completed');
  } catch (e) {
    spinner.stop();
    console.error('Deduplication error: ', e);
    throw e;
  }
};
