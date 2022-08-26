import util from 'util';
import childProcess from 'child_process';

const exec = util.promisify(childProcess.exec);

export const getPackageInfo = async (packageName: string, field?: string) => {
  const { stdout } = await exec(`npm view ${packageName} --json ${field ?? ''}`);

  return JSON.parse(stdout);
};
