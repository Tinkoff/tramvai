import path from 'path';
import type { ConfigEntry } from '../typings/configEntry/common';

export default (configEntry: ConfigEntry): string => {
  if (process.env.MODULE_VERSION) {
    return process.env.MODULE_VERSION;
  }

  const { root } = configEntry;

  try {
    const modulePackageJson = require(path.resolve(root, 'package.json'));

    return modulePackageJson.version;
  } catch (e) {
    return 'prerelease';
  }
};
