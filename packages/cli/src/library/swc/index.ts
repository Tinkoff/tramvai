import browserslist from 'browserslist';
import envTargets from '@tinkoff/browserslist-config';
import { sync as resolve } from 'resolve';
import type { Env } from '../../typings/Env';
import type { Target } from '../../typings/target';

interface SWCConfig {
  env?: Env;
  target?: Target;
  modern?: boolean;
  isServer?: boolean;
  typescript?: boolean;
  modules?: string | boolean;
  removeTypeofWindow?: boolean;
  alias?: Record<string, any>;
  bugfixes?: boolean; // https://babeljs.io/docs/en/babel-preset-env#bugfixes
  tramvai?: boolean;
  hot?: boolean;
  rootDir?: string;
}

function hasJsxRuntime() {
  try {
    resolve('react/jsx-runtime', { basedir: process.cwd() });
    return true;
  } catch (e) {
    return false;
  }
}
export const getSwcOptions = ({
  env = 'development',
  target,
  modern,
  isServer = false,
  modules = false,
  typescript = false,
  hot = false,
  rootDir = process.cwd(),
}: SWCConfig) => {
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
      corejs: '3',
      loose: true,
      mode: 'entry',
    },
    module: {
      type: modules || 'es6',
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
          useSpread: true,
          development: env === 'development',
          refresh: hot && !isServer,
        },
        optimizer: {
          globals: {
            typeofs: {
              window: isServer ? 'undefined' : 'object',
            },
          },
        },
      },
    },
  };
};
