import applyOrReturn from '@tinkoff/utils/function/applyOrReturn';
import path from 'path';
import type Config from 'webpack-chain';
import ExtractCssChunks from 'mini-css-extract-plugin';
import { createGenerator } from '@tinkoff/minicss-class-generator';
import { safeRequire } from '../../../utils/safeRequire';
import type { ConfigManager } from '../../../config/configManager';
import type { CliConfigEntry } from '../../../typings/configEntry/cli';

const cssLocalIdentNameDevDefault = '[name]__[local]_[minicss]';
const cssLocalIdentNameProdDefault = '[minicss]';

export const getPostcssConfigPath = (configManager: ConfigManager<CliConfigEntry>) => {
  return configManager.postcss.config ?? 'postcss.config';
};

interface Options {
  localIdentName?: string;
}

export const cssWebpackRulesFactory =
  (configManager: ConfigManager<CliConfigEntry>, options: Options = {}) =>
  (config: Config) => {
    const { env, sourceMap, buildType } = configManager;
    const {
      postcss: {
        config: postcssConfig,
        cssLocalIdentName = env === 'production'
          ? cssLocalIdentNameProdDefault
          : cssLocalIdentNameDevDefault,
        cssModulePattern,
      },
    } = configManager;
    const localIdentName = options.localIdentName ?? cssLocalIdentName;

    const configCssLoader = (cfg) => {
      cfg
        .use('extract-css')
        .loader(ExtractCssChunks.loader)
        .options({
          esModule: false,
          // we don't need the css on server, but it's needed to generate proper classnames in js
          emit: buildType === 'client',
        } as ExtractCssChunks.LoaderOptions);

      const cssModulesOptions: Record<string, any> = {
        localIdentName,
      };

      if (cssModulePattern) {
        cssModulesOptions.auto = new RegExp(cssModulePattern);
      }

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

    const postcssCfg =
      safeRequire(
        path.resolve(configManager.rootDir, getPostcssConfigPath(configManager)),
        // ignore missed file if users haven't provided any value
        // in case the path was provided it should exist
        typeof postcssConfig === 'undefined'
      ) ?? {};

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

export default cssWebpackRulesFactory;
