import applyOrReturn from '@tinkoff/utils/function/applyOrReturn';
import path from 'path';
import type Config from 'webpack-chain';
import ExtractCssChunks from 'mini-css-extract-plugin';
import { createGenerator } from '@tinkoff/minicss-class-generator';
import { safeRequire } from '../../../utils/safeRequire';
import type { ConfigManager } from '../../../config/configManager';

const cssLocalIdentNameDevDefault = '[name]__[local]_[minicss]';
const cssLocalIdentNameProdDefault = '[minicss]';

interface Options {
  localIdentName?: string;
}

// eslint-disable-next-line import/no-default-export
export default (configManager: ConfigManager, options: Options = {}) => (config: Config) => {
  const {
    postcss: {
      config: postcssConfig = '',
      cssLocalIdentName = null,
      cssLocalIdentNameDev = cssLocalIdentName ?? cssLocalIdentNameDevDefault,
      cssLocalIdentNameProd = cssLocalIdentName ?? cssLocalIdentNameProdDefault,
    } = {},
  } = configManager.build.configurations;
  const { env, sourceMap } = configManager;
  const localIdentName =
    options.localIdentName ?? (env === 'production' ? cssLocalIdentNameProd : cssLocalIdentNameDev);

  const configCssLoader = (cfg) => {
    cfg.use('extract-css').loader(ExtractCssChunks.loader).options({ esModule: false });

    const cssModulesOptions: Record<string, any> = {
      localIdentName,
    };

    // TODO: можно будет избавиться от проверки и сотавить всё в minicss-плагине, когда зарелизят эти изменения
    // https://github.com/webpack-contrib/css-loader/blob/master/src/utils.js#L310
    if (/\[minicss]/.test(localIdentName)) {
      cssModulesOptions.getLocalIdent = createGenerator();
    }

    cfg.use('css').loader('css-loader').options({
      modules: cssModulesOptions,
      sourceMap,
      importLoaders: 1,
      esModule: false,
    });
  };

  const postcssCfg = postcssConfig
    ? safeRequire(
        path.resolve(configManager.rootDir, postcssConfig),
        process.env.NODE_ENV === 'test'
      ) ?? {}
    : {};

  config.module
    .rule('css')
    .test(/\.css$/)
    .batch(configCssLoader)
    .use('postcss')
    .loader('postcss-loader')
    .options({
      sourceMap,
      postcssOptions: (...args) => ({
        ...postcssCfg,
        plugins: [
          require('postcss-modules-tilda'),
          require('postcss-modules-values-replace')({ importsAsModuleRequests: true }),
          // TODO: придумать как прокинуть настройки browserslist в autoprefixer - сейчас autoprefixer добавляется в самом приложении и из
          // конфига нет возможности задавать динамический env в зависимости от сборки. Подсунуть в сам autoprefixer после его инициализации тоже
          // тоже не получится - https://github.com/postcss/autoprefixer/blob/10.3.1/lib/autoprefixer.js#L108
          ...(applyOrReturn(args, postcssCfg.plugins) || []),
        ],
      }),
    });
};
