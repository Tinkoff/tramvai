import latestVersion from 'latest-version';
import type { Params } from './add';

export const checkPackage = async (_, { packageName }: Params) => {
  await latestVersion(packageName);

  return {
    name: 'checkPackage',
    status: 'ok',
  };
};
