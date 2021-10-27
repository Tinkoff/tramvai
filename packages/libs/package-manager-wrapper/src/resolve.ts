import { resolve } from 'path';
import { existsSync } from 'fs';
import type { PackageManager, PackageManagerOptions } from './PackageManager';
import { NpmPackageManager } from './NpmPackageManager';
import { UnknownPackageManager } from './UnsupportedPackageManager';
import { YarnPackageManager } from './YarnPackageManager';

const checkLockFile = (rootDir: string, lockName: string) => {
  return existsSync(resolve(rootDir, lockName));
};

export const resolvePackageManager = (
  packageManagerOptions: PackageManagerOptions,
  { throwUnknown = false }: { throwUnknown?: boolean } = {}
): PackageManager => {
  const { rootDir } = packageManagerOptions;
  let packageManager: PackageManager;

  if (checkLockFile(rootDir, 'yarn.lock')) {
    packageManager = new YarnPackageManager(packageManagerOptions);
  } else if (checkLockFile(rootDir, 'package-lock.json')) {
    packageManager = new NpmPackageManager(packageManagerOptions);
  } else {
    if (throwUnknown) {
      throw new Error(`Cannot find supported packageManager in "${rootDir}"`);
    }
    packageManager = new UnknownPackageManager(packageManagerOptions);
  }

  return packageManager;
};
