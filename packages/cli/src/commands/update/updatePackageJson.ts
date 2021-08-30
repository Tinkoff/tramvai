import { parse, minVersion } from 'semver';
import fs from 'fs';

import { getLatestPackageVersion } from './getLatestPackageVersion';

// Список пакетов, не начинающихся с @tramvai,
// которые мы также хотим обновить
const packagesToUpdate = [
  'browser-timings',
  'dippy',
  'dynamic-components',
  'hook-runner',
  'htmlpagebuilder',
  'meta-tags-generate',
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
  if (dep.startsWith('@tramvai') && getVersionFromDep(deps[dep]) === currentVersion) {
    console.log(`- ${dep}@${version}`);
    // eslint-disable-next-line no-param-reassign
    deps[dep] = version;
  } else if (shouldUpdateDependency(dep)) {
    const latestPackageVersion = await getLatestPackageVersion(dep);
    console.log(`- ${dep}@${latestPackageVersion}`);
    // eslint-disable-next-line no-param-reassign
    deps[dep] = latestPackageVersion;
  }
};

export const updatePackageJson = async (version: string) => {
  console.log('Обновляем package.json');
  const file = fs.readFileSync('package.json');
  const content = JSON.parse(file.toString());
  const currentVersion = getVersionFromDep(content.dependencies['@tramvai/core']);
  if (currentVersion === version) {
    throw new Error('Устанавливаемая версия равна текущей, обновление не требуется.');
  }
  for (const dep in content.dependencies) {
    if (Object.prototype.hasOwnProperty.call(content.dependencies, dep)) {
      await updateEntry(content.dependencies, dep, { currentVersion, version });
    }
  }
  for (const dep in content.devDependencies) {
    if (Object.prototype.hasOwnProperty.call(content.devDependencies, dep)) {
      await updateEntry(content.devDependencies, dep, { currentVersion, version });
    }
  }
  fs.writeFileSync('package.json', JSON.stringify(content, null, 2));
};
