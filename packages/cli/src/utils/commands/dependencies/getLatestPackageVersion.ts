import ora from 'ora';
import latestVersion from 'latest-version';

export const getLatestPackageVersion = async (packageName: string, version = 'latest') => {
  const spinner = ora(`Resolving the highest version satifying to ${version}`).start();

  try {
    const result = await latestVersion(packageName, { version });

    return result;
  } finally {
    spinner.stop();
  }
};
