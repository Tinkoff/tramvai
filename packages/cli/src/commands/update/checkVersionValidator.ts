import util from 'util';
import childProcess from 'child_process';
import type { Params } from './update';

const exec = util.promisify(childProcess.exec);

export const checkVersion = async (_, { to: version = 'latest' }: Params) => {
  if (version === 'latest') {
    return {
      name: 'checkVersion',
      status: 'ok',
    };
  }

  const { stdout } = await exec(`npm view @tramvai/core@${version} version`);

  if (stdout.indexOf(version) !== -1) {
    return {
      name: 'checkVersion',
      status: 'ok',
    };
  }

  throw new Error(`Version ${version} does not exists`);
};
