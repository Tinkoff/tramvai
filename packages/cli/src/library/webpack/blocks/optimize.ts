import type Config from 'webpack-chain';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizer from 'css-minimizer-webpack-plugin';
import CssoWebpackPlugin from 'csso-webpack-plugin';
import type { ConfigManager } from '../../../config/configManager';
import type { CliConfigEntry } from '../../../typings/configEntry/cli';

export default (configManager: ConfigManager<CliConfigEntry>) => (config: Config) => {
  const { modern, debug, disableProdOptimization } = configManager;

  if (disableProdOptimization) {
    // with this option for id of module path to file will be used
    config.optimization.set('moduleIds', 'named');
    // prevent modules from concatenation in single module to easier debug
    config.optimization.set('concatenateModules', false);

    config.plugin('terser').use(TerserPlugin, [
      {
        extractComments: false,
        terserOptions: {
          ecma: 6,
          mangle: false,
          output: {
            comments: true,
            semicolons: false,
            preserve_annotations: true,
            indent_start: 2,
            beautify: true,
          },
          compress: {
            passes: 2,
            drop_debugger: !debug,
          },
        },
      },
    ]);

    return;
  }

  const { terser } = configManager;

  config.plugin('terser').use(TerserPlugin, [
    {
      extractComments: false,
      parallel: terser.parallel,
      terserOptions: {
        ecma: modern ? 6 : 5,
        mangle: {
          // https://github.com/node-fetch/node-fetch/issues/667
          // иначе AbortSignal минифицируется и на сервере падает ошибка в node-fetch
          reserved: ['AbortSignal'],
        },
        output: {
          comments: false,
        },
        compress: {
          passes: 2,
          drop_debugger: !debug,
        },
      },
    },
  ]);

  if (configManager.cssMinimize === 'csso') {
    config.plugin('csso').use(CssoWebpackPlugin as any, [{ restructure: false }]);
  } else {
    config.plugin('css-minimizer').use(CssMinimizer);
  }
};
