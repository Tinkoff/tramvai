import path from 'path';
import type { Env } from '../typings/Env';
import type { ConfigEntry } from '../typings/configEntry/common';
import { safeRequire } from './safeRequire';

export const packageVersion = (configEntry: ConfigEntry, env: Env, rootDir: string): string => {
  if (env !== 'production') {
    return '0.0.0-stub';
  }

  const { root } = configEntry;

  try {
    const modulePackageJson =
      // try to find package json for the child-app first in the directory that child-app resides
      safeRequire(path.resolve(root, 'package.json'), true) ??
      // also try one directory above if root directory is src
      safeRequire(path.resolve(root.replace(/\/src\/?$/, ''), 'package.json'), true) ??
      // try the package.json that resides with tramvai.json
      safeRequire(path.resolve(rootDir, 'package.json'), true);

    return modulePackageJson.version;
  } catch (e) {
    return 'prerelease';
  }
};
