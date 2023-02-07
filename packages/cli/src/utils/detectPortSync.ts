import { execSync } from 'child_process';

export const detectPortSync = (port: number): number => {
  const commandResult = execSync(`npx detect-port ${port}`);

  return parseInt(commandResult.toString('utf-8'), 10);
};
