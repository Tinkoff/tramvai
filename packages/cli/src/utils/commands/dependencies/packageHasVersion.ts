import util from 'util';
import childProcess from 'child_process';

const exec = util.promisify(childProcess.exec);

export const packageHasVersion = async (packageName: string, version: string): Promise<boolean> => {
  try {
    const { stdout } = await exec(`npm view ${packageName}@${version} version`);
    const hasVersion = !!stdout.trim().replace('\n', '');
    return hasVersion;
  } catch (e) {
    return false;
  }
};
