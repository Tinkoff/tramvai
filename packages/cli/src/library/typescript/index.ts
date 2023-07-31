import path from 'path';
import omit from '@tinkoff/utils/object/omit';
import type { Env } from '../../typings/Env';
import { babelConfigFactory } from '../babel';

const rootDir = process.cwd();

interface Options {
  env: Env;
  modern: boolean;
  isServer: boolean;
  tramvai?: boolean;
}

export default (options: Options) => {
  const { env, modern, isServer, tramvai } = options;

  return {
    errorsAsWarnings: true,
    cacheDirectory: path.resolve(rootDir, `.tmp/ts-${env}-${isServer ? 'server' : 'client'}`),
    useCache: true,
    silent: true,
    useBabel: true,
    // для лоадера конфиг отличается от plain babel config, нужно преобразовывать
    babelOptions: omit(
      ['cacheDirectory', 'cacheIdentifier'],
      babelConfigFactory({
        env,
        isServer,
        modern,
        tramvai,
      })
    ),
  };
};
