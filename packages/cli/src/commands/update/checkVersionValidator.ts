import { packageHasVersion } from '../../utils/commands/dependencies/packageHasVersion';
import type { Params } from './update';

export const checkVersion = async (_, { to: version = 'latest' }: Params) => {
  if (version === 'latest') {
    return {
      name: 'checkVersion',
      status: 'ok',
    };
  }

  if (await packageHasVersion('@tramvai/core', version)) {
    return {
      name: 'checkVersion',
      status: 'ok',
    };
  }

  throw new Error(`Version ${version} does not exists`);
};
