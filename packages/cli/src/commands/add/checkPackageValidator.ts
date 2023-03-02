import latestVersion from 'latest-version';
import type { Params } from './add';

export const checkPackage = async (_, { packageName }: Params) => {
  try {
    await latestVersion(packageName);
  } catch (e) {
    throw new Error(`Package ${packageName} does not exists`);
  }

  return {
    name: 'checkPackage',
    status: 'ok',
  };
};
