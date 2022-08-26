import { getLatestPackageVersion } from '../../utils/commands/dependencies/getLatestPackageVersion';
import { getPackageInfo } from '../../utils/commands/dependencies/getPackageInfo';

// map of packages that is not in unified versioning
// but we still want to update it
// actual version to update will be calculated from the some of the @tramvai/module
const DEPENDANT_LIBS_MAP = new Map([
  ['@tinkoff/logger', '@tramvai/module-log'],
  ['@tinkoff/dippy', '@tramvai/core'],
  ['@tinkoff/router', '@tramvai/module-router'],
  ['@tinkoff/url', '@tramvai/module-common'],
  ['@tinkoff/errors', '@tramvai/module-common'],
  ['@tinkoff/roles', '@tramvai/module-authenticate'],
  ['@tinkoff/pubsub', '@tramvai/module-common'],
  ['@tinkoff/hook-runner', '@tramvai/module-common'],
  ['@tinkoff/htmlpagebuilder', '@tramvai/module-render'],
  ['@tinkoff/browser-timings', '@tramvai/module-metrics'],
  ['@tinkoff/meta-tags-generate', '@tramvai/module-render'],
  ['@tinkoff/pack-polyfills', ''],
  ['@tinkoff/browserslist-config', '@tramvai/cli'],
]);

export const isDependantLib = (name: string) => {
  return DEPENDANT_LIBS_MAP.has(name);
};

export const getLibPackageVersion = async (
  name: string,
  unifiedVersion: string
): Promise<string | undefined> => {
  const unifiedModule = DEPENDANT_LIBS_MAP.get(name);

  if (!unifiedModule) {
    return getLatestPackageVersion(name);
  }

  const deps = await getPackageInfo(`${unifiedModule}@${unifiedVersion}`, 'dependencies');

  if (!deps[name]) {
    console.warn(
      `⚠️ cannot resolve proper version for the "${name}" package.
You have to update this package by yourself.`
    );

    return;
  }

  return deps[name];
};
