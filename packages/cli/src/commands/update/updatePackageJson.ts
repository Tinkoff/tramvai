import { parse, minVersion } from 'semver';
import fs from 'fs';
import pMap from 'p-map';
import { getLatestPackageVersion } from '../../utils/commands/dependencies/getLatestPackageVersion';
import { packageHasVersion } from '../../utils/commands/dependencies/packageHasVersion';

// Список пакетов, не начинающихся с @tramvai,
// которые мы также хотим обновить
const packagesToUpdate = [
  '@tinkoff/logger',
  '@tinkoff/dippy',
  '@tinkoff/router',
  '@tinkoff/url',
  '@tinkoff/errors',
  '@tinkoff/roles',
  '@tinkoff/pubsub',
  '@tinkoff/hook-runner',
  '@tinkoff/htmlpagebuilder',
  '@tinkoff/browser-timings',
  '@tinkoff/meta-tags-generate',
  '@tinkoff/pack-polyfills',
  '@tinkoff/browserslist-config',
];

const shouldUpdateDependency = (name: string) => {
  return name.startsWith('@tramvai') || packagesToUpdate.includes(name);
};

const getVersionFromDep = (dep) => parse(dep)?.version || minVersion(dep)?.version;

const updateEntry = async (
  deps: Record<string, any>,
  dep: string,
  { currentVersion, version }: { currentVersion: string; version: string }
) => {
  let nextVersion: string;

  if (dep.startsWith('@tramvai') && getVersionFromDep(deps[dep]) === currentVersion) {
    nextVersion = version;
  } else if (shouldUpdateDependency(dep)) {
    const latestPackageVersion = await getLatestPackageVersion(dep);
    nextVersion = latestPackageVersion;
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
