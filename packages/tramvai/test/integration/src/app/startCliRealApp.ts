import type { StartCliOptions } from './startCli';
import { startCli } from './startCli';

export const runRealApp = async (
  tramvaiConfigRoot: string,
  appName: string,
  options: StartCliOptions
) => {
  return startCli(appName, {
    ...options,
    rootDir: tramvaiConfigRoot,
  });
};
