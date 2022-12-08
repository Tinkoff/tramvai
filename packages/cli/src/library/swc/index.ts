import isEmpty from '@tinkoff/utils/is/empty';
import path from 'path';
import { existsSync } from 'fs';
import browserslist from 'browserslist';
import envTargets from '@tinkoff/browserslist-config';
import { sync as resolve } from 'resolve';
import findCacheDir from 'find-cache-dir';
import type { Config } from '@swc/core';
import type { TranspilerConfig } from '../webpack/utils/transpiler';

const TRAMVAI_SWC_TARGET_PATH = '@tramvai/swc-integration/target/wasm32-wasi';

const NOT_SUPPORTED_FIELDS = ['alias', 'generateDataQaTag', 'enableFillActionNamePlugin'];
let warningWasShown = false;

export const getSwcOptions = (config: TranspilerConfig): Config => {
  const {
    env = 'development',
    target,
    modern,
    isServer = false,
    modules = false,
    typescript = false,
    hot = false,
    removeTypeofWindow,
    tramvai = false,
    rootDir = process.cwd(),
  } = config;

  if (!warningWasShown) {
    for (const field of NOT_SUPPORTED_FIELDS) {
      if (config[field] && !isEmpty(config[field])) {
        console.warn(
          `@tramvai/swc-integration do not support "${field}" configuration. Consider removing it from tramvai.json`
        );

        warningWasShown = true;
      }
    }

    const swcrcPath = path.resolve(rootDir, '.swcrc');

    if (existsSync(swcrcPath)) {
      console.warn(
        `Found .swcrc config in the app root directory ("${swcrcPath}").
Having swc config may conflict with @tramvai/cli configuration`
      );

      warningWasShown = true;
    }
  }

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
      type: modules || 'es6',
    },
    jsc: {
      // TODO: should trim output size, but doesn't work well with some libs
      // externalHelpers: true,
      parser: {
        syntax: typescript ? 'typescript' : 'ecmascript',
        decorators: true,
        tsx: true,
        jsx: true,
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
            // let the webpack replace NODE_ENV as replacement with swc may mess up with tests
            envs: [],
            // @ts-ignore
            // TODO: there is not typings for typeofs, but the field is mentioned in docs
            typeofs: removeTypeofWindow
              ? {
                  window: isServer ? 'undefined' : 'object',
                }
              : {},
          },
        },
      },
      experimental: {
        cacheRoot: findCacheDir({ cwd: rootDir, name: 'swc' }),
        plugins: [
          [resolveTramvaiSwcPlugin('create_token_pure'), {}],
          [resolveTramvaiSwcPlugin('lazy_component'), {}],
          isServer && [resolveTramvaiSwcPlugin('dynamic_import_to_require'), {}],
          tramvai && env === 'development' && [resolveTramvaiSwcPlugin('provider_stack'), {}],
        ].filter(Boolean) as Array<[string, Record<string, any>]>,
      },
    },
  };
};
