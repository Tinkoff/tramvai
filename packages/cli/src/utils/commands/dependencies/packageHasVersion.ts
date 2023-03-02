import latestVersion from 'latest-version';

export const packageHasVersion = async (packageName: string, version: string): Promise<boolean> => {
  try {
    await latestVersion(packageName, { version });
    return true;
  } catch (e) {
    return false;
  }
};
