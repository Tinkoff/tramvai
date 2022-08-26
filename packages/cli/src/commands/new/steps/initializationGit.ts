import execa from 'execa';
import chalk from 'chalk';

export async function initializationGit(localDir) {
  console.log(`${chalk.blue('[GIT]')} Initializing git`);

  await execa('git', ['init'], { cwd: localDir, stdio: 'inherit' });
}
