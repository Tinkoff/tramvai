import { parse, minVersion } from 'semver';
import fs from 'fs';
import pMap from 'p-map';
import { packageHasVersion } from '../../utils/commands/dependencies/packageHasVersion';
import { getLibPackageVersion, isDependantLib } from './dependantLibs';

const isUnifiedVersion = (name: string) => {
  return name.startsWith('@tramvai');
};

const getVersionFromDep = (dep) => parse(dep)?.version || minVersion(dep)?.version;

const updateEntry = async (
  deps: Record<string, any>,
  dep: string,
  { currentVersion, version }: { currentVersion: string; version: string }
) => {
  let nextVersion: string;

  if (isUnifiedVersion(dep) && getVersionFromDep(deps[dep]) === currentVersion) {
    nextVersion = version;
  } else if (isDependantLib(dep)) {
    const libVersion = await getLibPackageVersion(dep, version);
    nextVersion = libVersion;
  }

  if (nextVersion) {
    const depHasVersion = await packageHasVersion(dep, nextVersion);

    if (depHasVersion) {
      console.log(`- ${dep}@${nextVersion}`);
      // eslint-disable-next-line no-param-reassign
      deps[dep] = nextVersion;
    } else {
      console.warn(
        `⚠️ cannot update ${dep} to ${nextVersion} version, this version does not exist.
Maybe this package was removed or renamed.
Wait migrations, then manually update or remove dependency from package.json, if necessary.`
      );
    }
  }
};

const updateDependencies = (
  dependencies: Record<string, string> = {},
  targetVersion: string,
  currentVersion: string
) => {
  return pMap<string, void>(
    Object.keys(dependencies),
    async (dep) => {
      if (Object.prototype.hasOwnProperty.call(dependencies, dep)) {
        await updateEntry(dependencies, dep, { currentVersion, version: targetVersion });
      }
    },
    {
      concurrency: 10,
    }
  );
};

export const updatePackageJson = async (version: string) => {
  console.log(`Update package.json to ${version} version`);

  const file = fs.readFileSync('package.json');
  const content = JSON.parse(file.toString());
  const currentVersion = getVersionFromDep(content.dependencies['@tramvai/core']);

  if (currentVersion === version) {
    console.error('The installed version is equal to the current version, no update is required.');
    process.exit(0);
  }

  await updateDependencies(content.dependencies, version, currentVersion);
  await updateDependencies(content.devDependencies, version, currentVersion);
  await updateDependencies(content.peerDependencies, version, currentVersion);

  fs.writeFileSync('package.json', JSON.stringify(content, null, 2));
};
