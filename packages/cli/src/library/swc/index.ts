import browserslist from 'browserslist';
import envTargets from '@tinkoff/browserslist-config';
import { sync as resolve } from 'resolve';
import findCacheDir from 'find-cache-dir';
import type { Config } from '@swc/core';
import type { Env } from '../../typings/Env';
import type { Target } from '../../typings/target';

interface SWCConfig {
  env?: Env;
  target?: Target;
  modern?: boolean;
  isServer?: boolean;
  typescript?: boolean;
  modules?: Config['module']['type'] | false;
  removeTypeofWindow?: boolean;
  alias?: Record<string, any>;
  bugfixes?: boolean; // https://babeljs.io/docs/en/babel-preset-env#bugfixes
  tramvai?: boolean;
  hot?: boolean;
  rootDir?: string;
}

const TRAMVAI_SWC_TARGET_PATH = '@tramvai/swc-integration/target/wasm32-wasi';

export const getSwcOptions = ({
  env = 'development',
  target,
  modern,
  isServer = false,
  modules = false,
  typescript = false,
  hot = false,
  rootDir = process.cwd(),
}: SWCConfig): Config => {
  const resolveWasmFile = (pluginName: string, type: 'debug' | 'release') => {
    return resolve(`${TRAMVAI_SWC_TARGET_PATH}/${type}/${pluginName}.wasm`, {
      basedir: rootDir,
    });
  };

  const resolveTramvaiSwcPlugin = (pluginName: string) => {
    try {
      return resolveWasmFile(pluginName, 'debug');
    } catch (_) {
      try {
        return resolveWasmFile(pluginName, 'release');
      } catch (__) {
        throw new Error(
          `Cannot find tramvai swc-plugin "${pluginName}" related to the "${rootDir}" directory`
        );
      }
    }
  };
  function hasJsxRuntime() {
    try {
      resolve('react/jsx-runtime', { basedir: rootDir });
      return true;
    } catch (e) {
      return false;
    }
  }

  let resultTarget = target;

  if (!target) {
    if (isServer) {
      resultTarget = 'node';
    } else if (modern) {
      resultTarget = 'modern';
    }
  }

  const browserslistConfigRaw = browserslist.findConfig(rootDir);

  // выставляем дефолты если явный конфиг для browserslist не был найден или в нём нет нужного targets
  const browserslistQuery =
    browserslistConfigRaw?.[resultTarget] ?? envTargets[resultTarget] ?? envTargets.defaults;

  const targets = browserslist(browserslistQuery, {
    mobileToDesktop: true,
    env: resultTarget,
  });

  return {
    env: {
      targets,
      coreJs: '3',
      loose: true,
      mode: 'entry',
    },
    module: {
      type: modules || undefined,
    },
    jsc: {
      // TODO: should trim output size, but doesn't work well with some libs
      // externalHelpers: true,
      parser: {
        syntax: typescript ? 'typescript' : 'ecmascript',
        decorators: true,
      },
      transform: {
        legacyDecorator: true,
        react: {
          runtime: hasJsxRuntime() ? 'automatic' : 'classic',
          development: env === 'development',
          refresh: hot && !isServer,
        },
        optimizer: {
          globals: {
            // @ts-ignore
            // TODO: there is not typings for typeofs, but the field is mentioned in docs
            typeofs: {
              window: isServer ? 'undefined' : 'object',
            },
          },
        },
      },
      experimental: {
        cacheRoot: findCacheDir({ cwd: rootDir, name: 'swc' }),
        plugins: [[resolveTramvaiSwcPlugin('create_token_pure'), {}]],
      },
    },
  };
};
