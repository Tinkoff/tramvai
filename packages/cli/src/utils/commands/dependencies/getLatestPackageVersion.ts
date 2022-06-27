import util from 'util';
import childProcess from 'child_process';

const exec = util.promisify(childProcess.exec);

export const getLatestPackageVersion = async (packageName: string, distTag = 'latest') => {
  const { stdout } = await exec(`npm view ${packageName}@${distTag} version`);
  const version = stdout.replace('\n', '');
  return version;
};
