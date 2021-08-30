import type { Config } from '../typings/projectType';
import { getRootFile } from './getRootFile';

const tramvaiConfigNames = ['tramvai.json', 'platform.json'];

export function getTramvaiConfig(
  rootDir?: string
): {
  content: Config;
  isSuccessful: boolean;
  path?: string;
  configName?: string;
} {
  for (const name of tramvaiConfigNames) {
    const result = getRootFile<Config>(name, rootDir);

    if (result.isSuccessful) {
      return {
        ...result,
        configName: name,
      };
    }
  }

  return {
    content: undefined,
    isSuccessful: false,
  };
}
