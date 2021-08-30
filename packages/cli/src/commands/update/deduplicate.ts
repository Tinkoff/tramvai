import ora from 'ora';
import util from 'util';
import childProcess from 'child_process';
import { npmRequire } from '../../utils/npmRequire';
import { CLI_PACKAGE_MANAGER } from '../../di/tokens';
import type { Context } from '../../models/context';

const exec = util.promisify(childProcess.exec);

export const deduplicate = async (context: Context) => {
  const spinner = ora('Дедупликация зависимостей в lock-файле').start();

  try {
    await context.packageManager.dedupe();
    spinner.stop();
    console.log('Завершено');
  } catch (e) {
    spinner.stop();
    console.error('Ошибка дедупликации: ', e);
    throw e;
  }
};
