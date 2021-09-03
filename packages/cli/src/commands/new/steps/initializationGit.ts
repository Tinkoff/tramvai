import execa from 'execa';
import chalk from 'chalk';

export async function initializationGit(localDir) {
  console.log(chalk.blue('[START]'), 'Initializing git');
  await execa('git', ['init'], { cwd: localDir }).then(() => 'git is initialized');
}
