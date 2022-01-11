import type { SemVer } from 'semver';
import { logger } from '@tinkoff/logger';

const log = logger('tramvai-check-versions');

export const checkVersions = (depsVersions: Map<string, SemVer>) => {
  // Pre-release versions must be processed separately,
  // for them it is enough to check that they are higher,
  // than other stable versions.
  // If all versions of the tramvai libraries of the application will be pre-release,
  // they will not be compared to each other.
  const prereleaseDepsVersions: Map<string, SemVer> = new Map();
  let maxVersion: SemVer;
  let hasWrongVersions = false;

  depsVersions.forEach((version, name) => {
    if (version.prerelease.length > 0) {
      prereleaseDepsVersions.set(name, version);
      return;
    }

    maxVersion = maxVersion ?? version;

    const compareResult = maxVersion.compare(version);

    if (compareResult !== 0) {
      hasWrongVersions = true;
      maxVersion = compareResult === -1 ? version : maxVersion;
    }
  });

  prereleaseDepsVersions.forEach((version) => {
    if (maxVersion && maxVersion.compare(version) !== -1) {
      hasWrongVersions = true;
    }
  });

  if (!hasWrongVersions) {
    log.info('The tramvai versions are okay!');
    return;
  }

  log.error(`The versions of the tramvai modules do not match!

  It is necessary to do the following:
    1. Check package.json and set the package versions to a fixed version "${maxVersion.raw}" for the packages listed below
    2. Update the lock file with the command "npm i" or "yarn"
    3. If after upgrading the error still occurs - check the lock file for incorrect versions and maybe rebuild the lock file
    4. If there is no version of a package when you upgrade, it is probably an outdated package and you should look up for the replacement at https://tramvai.dev/docs/releases/migration.

  List of packages to update:
`);

  depsVersions.forEach((version, name) => {
    if (maxVersion.compare(version) !== 0) {
      log.error(`\t\t${name}`);
    }
  });
  prereleaseDepsVersions.forEach((version, name) => {
    if (maxVersion.compare(version) !== -1) {
      log.error(`\t\t${name}`);
    }
  });

  // иначе yarn обрезает последний лог
  log.error('\n');

  process.exit(1);
};
