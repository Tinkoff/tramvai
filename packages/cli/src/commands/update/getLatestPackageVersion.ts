import util from 'util';
import childProcess from 'child_process';

const exec = util.promisify(childProcess.exec);

export const getLatestPackageVersion = async (packageName: string) => {
  const { stdout } = await exec(`npm view ${packageName} version`);
  const version = stdout.replace('\n', '');
  return version;
};
