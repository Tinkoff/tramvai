import { getPackageInfo } from './getPackageInfo';

export const getLatestPackageVersion = async (packageName: string, distTag = 'latest') => {
  return getPackageInfo(`${packageName}@${distTag}`, 'version');
};
