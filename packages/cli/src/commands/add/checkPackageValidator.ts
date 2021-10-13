import util from 'util';
import childProcess from 'child_process';
import type { Params } from './add';

const exec = util.promisify(childProcess.exec);

export const checkPackage = async (_, { packageName }: Params) => {
  try {
    await exec(`npm view ${packageName}`);
  } catch (e) {
    throw new Error(`Package ${packageName} does not exists`);
  }

  return {
    name: 'checkPackage',
    status: 'ok',
  };
};
