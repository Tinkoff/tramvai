import path from 'path';
import browserslist from 'browserslist';
import envTargets from '@tinkoff/browserslist-config';
import { sync as resolve } from 'resolve';
import type { TransformOptions } from '@babel/core';
import type { TranspilerConfig } from '../webpack/utils/transpiler';

const envConfig = {
  production: {
    plugins: [
      '@babel/plugin-transform-react-constant-elements',
      [
        'transform-react-remove-prop-types',
        {
          removeImport: true,
        },
      ],
    ],
  },
};

function hasJsxRuntime() {
  try {
    resolve('react/jsx-runtime', { basedir: process.cwd() });
    return true;
  } catch (e) {
    return false;
  }
}

export const babelConfigFactory = ({
  env = 'development',
  target,
  modern,
  isServer = false,
  modules = false,
  generateDataQaTag = true,
  enableFillActionNamePlugin = false,
  // for testing only!
  // @ts-expect-error
  markCreateTokenAsPure = true,
  typescript = false,
  loader = true,
  removeTypeofWindow,
  tramvai = false,
  hot = false,
  excludesPresetEnv,
  rootDir = process.cwd(),
}: Partial<TranspilerConfig>) => {
  const cfg = envConfig[env] || {};
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

  const babelConfig = {
    // по умолчанию sourceType: 'module' и тогда бабель рассматривает все файлы как es-модули, что может
    // вызвать проблемы в некоторых случаях когда бабель обрабатывает уже скомпиленный в commonjs файл
    // как модуль добавляя в него es-импорты и вводя этим вебпак в ступор на счет типа файла
    // unambiguos - режим когда бабель попытается предугадать тип компилируемого файла и уже на этой
    // основе добавлять соответствующие импорты
    sourceType: 'unambiguous' as const,

    // Это необходимо для того, чтобы деструктуризация array-like сущностей, например, Set
    // не приводила к невалидному коду при сборке для старых браузеров:
    // [...new Set()] => [].concat(new Set())
    // https://babeljs.io/docs/assumptions#arraylikeisiterable
    assumptions: {
      arrayLikeIsIterable: true,
      iterableIsArray: false,
    },

    presets: [
      [
        '@babel/preset-env',
        {
          modules,
          useBuiltIns: 'entry',
          // from core-js version depends what polyfills will be included with `useBuiltIns: 'entry'` option
          // this logic is here - https://github.com/zloirock/core-js/blob/master/packages/core-js-compat/src/modules-by-versions.mjs
          corejs: require('core-js/package.json').version,
          loose: true,
          targets,
          browserslistEnv: resultTarget,
          bugfixes: resultTarget === 'modern',
          exclude: excludesPresetEnv,
        },
      ],
      [
        '@babel/preset-react',
        {
          runtime: hasJsxRuntime() ? 'automatic' : 'classic',
          useSpread: true,
          development: env === 'development',
        },
      ],
      typescript && '@babel/preset-typescript',
    ]
      .concat(cfg.presets || [])
      .filter(Boolean) as TransformOptions['presets'],

    plugins: [
      // TODO: useESModules is deprecated and should work automatically - https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
      ['@babel/transform-runtime', { useESModules: !(isServer && env === 'development') }],
      path.resolve(__dirname, './plugins/lazy-component/legacy-universal-replace'), // TODO: удалить плагин после того как отпадёт необходимость поддерживать легаси
      path.resolve(__dirname, './plugins/lazy-component/lazy-component'),
      generateDataQaTag && path.resolve(__dirname, './plugins/react-element-info-unique'), // Собственный плагин. Необходимо удалить в будущем
      enableFillActionNamePlugin && path.resolve(__dirname, './plugins/fill-action-name'), // Собственный плагин. Необходимо удалить в будущем
      markCreateTokenAsPure && path.resolve(__dirname, './plugins/create-token-pure'),
      ['lodash', { id: ['ramda'] }],
      isServer && 'babel-plugin-dynamic-import-node',
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true,
        },
      ],
      [
        '@babel/plugin-proposal-class-properties',
        {
          loose: true,
        },
      ],
      '@babel/plugin-proposal-export-default-from',
      removeTypeofWindow && [
        'transform-define',
        {
          'typeof window': isServer ? 'undefined' : 'object',
        },
      ],
      tramvai && env === 'development' && path.resolve(__dirname, './plugins/provider-stack'),
      !isServer &&
        env === 'development' &&
        hot && ['react-refresh/babel', { skipEnvCheck: process.env.NODE_ENV === 'test' }],
    ]
      .concat(cfg.plugins || [])
      .filter(Boolean),
  };

  const loaderConfig = loader
    ? {
        cwd: path.resolve(__dirname, '..', '..', '..'),
        compact: false,
      }
    : {};

  return {
    ...babelConfig,
    ...loaderConfig,
  };
};

export default babelConfigFactory;
