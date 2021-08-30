import execa from 'execa';
import chalk from 'chalk';

export async function initializationGit(localDir) {
  console.log(chalk.blue('[START]'), 'Инициализируем git');
  await execa('git', ['init'], { cwd: localDir }).then(() => 'git проинициализирован');
}
