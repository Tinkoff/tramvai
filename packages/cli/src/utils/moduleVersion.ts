import path from 'path';
import type { ModuleConfigEntry } from '../typings/configEntry/module';

export default (configEntry: ModuleConfigEntry): string => {
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
