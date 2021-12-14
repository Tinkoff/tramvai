import path from 'path';
import type { Env } from '../typings/Env';

export const packageVersion = (env: Env, rootDir: string): string => {
  if (env !== 'production') {
    return '0.0.0-stub';
  }

  try {
    const modulePackageJson = require(path.resolve(rootDir, 'package.json'));

    return modulePackageJson.version;
  } catch (e) {
    return 'prerelease';
  }
};
