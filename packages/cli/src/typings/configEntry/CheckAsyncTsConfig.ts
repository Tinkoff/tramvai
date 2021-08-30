// eslint-disable-next-line no-restricted-imports
import type { ForkTsCheckerWebpackPluginOptions } from 'fork-ts-checker-webpack-plugin/lib/ForkTsCheckerWebpackPluginOptions';

export interface CheckAsyncTsConfig {
  /**
   * при включении этого флага в build-сборку добавляется проверка типов
   * при невалидных типах сборка падает
   */
  failOnBuild?: boolean;
  /**
   * дополнительные опции
   * @link https://github.com/TypeStrong/fork-ts-checker-webpack-plugin
   */
  pluginOptions?: Partial<ForkTsCheckerWebpackPluginOptions>;
}
