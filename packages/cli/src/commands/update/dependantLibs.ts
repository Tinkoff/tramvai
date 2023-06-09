import getLatestPackageVersion from 'latest-version';
import getPackageInfo from 'package-json';
import { DEPENDANT_LIBS_MAP } from '../../utils/tramvaiVersions';

export const getLibPackageVersion = async (
  name: string,
  unifiedVersion: string
): Promise<string | undefined> => {
  const unifiedModule = DEPENDANT_LIBS_MAP.get(name);

  if (!unifiedModule) {
    return getLatestPackageVersion(name);
  }

  const { dependencies } = await getPackageInfo(unifiedModule, { version: unifiedVersion });

  if (!dependencies[name]) {
    console.warn(
      `⚠️ cannot resolve proper version for the "${name}" package.
You have to update this package by yourself.`
    );

    return;
  }

  return dependencies[name];
};
