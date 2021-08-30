import { execSync } from 'child_process';

export function fixGitRepo() {
  try {
    execSync('git rev-parse origin/master');
  } catch (e) {
    execSync('git fetch', { stdio: 'inherit', encoding: 'utf-8' });
  }
}
