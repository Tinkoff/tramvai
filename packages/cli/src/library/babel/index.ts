import path from 'path';
import browserslist from 'browserslist';
import envTargets from '@tinkoff/browserslist-config';
import { sync as resolve } from 'resolve';
import type { Env } from '../../typings/Env';
import type { Target } from '../../typings/target';

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

interface BabelConfig {
  env?: Env;
  target?: Target;
  modern?: boolean;
  isServer?: boolean;
  generateDataQaTag?: boolean;
  enableFillActionNamePlugin?: boolean;
  typescript?: boolean;
  modules?: string | boolean;
  loader?: boolean;
  useESModules?: boolean;
  removeTypeofWindow?: boolean;
  alias?: Record<string, any>;
  tramvai?: boolean;
  hot?: boolean;
  excludesPresetEnv?: string[];
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

export const babelConfigFactory = ({
  env = 'development',
  target,
  modern,
  isServer = false,
  modules = false,
  generateDataQaTag = true,
  enableFillActionNamePlugin = false,
  typescript = false,
  useESModules = !(isServer && env === 'development'), // на сервере в режиме дев node_modules не компилятся поэтому отключаем ESModules,
  loader = true,
  removeTypeofWindow,
  alias,
  tramvai = false,
  hot = false,
  excludesPresetEnv,
  rootDir = process.cwd(),
}: BabelConfig) => {
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

    presets: [
      [
        '@babel/preset-env',
        {
          modules,
          useBuiltIns: 'entry',
          corejs: '3',
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
      .filter(Boolean),

    plugins: [
      ['@babel/transform-runtime', { useESModules }],
      path.resolve(__dirname, './plugins/lazy-component/legacy-universal-replace'), // TODO: удалить плагин после того как отпадёт необходимость поддерживать легаси
      path.resolve(__dirname, './plugins/lazy-component/lazy-component'),
      generateDataQaTag && path.resolve(__dirname, './plugins/react-element-info-unique'), // Собственный плагин. Необходимо удалить в будущем
      enableFillActionNamePlugin && path.resolve(__dirname, './plugins/fill-action-name'), // Собственный плагин. Необходимо удалить в будущем
      ['lodash', { id: ['ramda'] }],
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          alias,
        },
      ],
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
