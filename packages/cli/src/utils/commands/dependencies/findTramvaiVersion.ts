import { parse, minVersion } from 'semver';
import fs from 'fs';

const getVersionFromDep = (dep) => parse(dep)?.version || minVersion(dep)?.version;

export const findTramvaiVersion = async () => {
  const file = fs.readFileSync('package.json');
  const content = JSON.parse(file.toString());
  const currentVersion = getVersionFromDep(content.dependencies['@tramvai/core']);

  return currentVersion;
};
