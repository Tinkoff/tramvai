import { RuntimeModule, RuntimeGlobals } from 'webpack';
import type webpack from 'webpack';
import type { Compiler } from 'webpack';

const PLUGIN_NAME = 'RuntimePathPlugin';

interface Options {
  publicPath: string;
}

/**
 * RuntimePathPlugin необходим для правильной генерации ссылок на ассеты (картинки и т.п. которые грузятся через file-loader или url-loader)
 */
export default class RuntimePathPlugin implements webpack.WebpackPluginInstance {
  protected options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    const publicPathEval = this.options.publicPath;
    const compilerPublicPath = compiler.options.output.publicPath ?? '';
    const defaultPublicPath =
      compilerPublicPath === 'auto' ? compilerPublicPath : `"${compilerPublicPath}"`;

    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.runtimeRequirementInTree
        .for(RuntimeGlobals.publicPath)
        .tap(PLUGIN_NAME, (chunk) => {
          // set custom public path only to entries as this way public path will be constructed in runtime
          // some of the webpack plugins may use [importModule](https://webpack.js.org/api/loaders/#thisimportmodule) that allows execute modules at build time
          // for example mini-css-extract-plugin uses this method that leads to error `window is not defined` at build if we don't
          // prevent adding dynamic code to every chunk altogether
          const isEntry = compilation.entries.has(chunk.name.toString());

          compilation.addRuntimeModule(
            chunk,
            new (class extends RuntimeModule {
              generate() {
                // setting dynamic publicPath
                return `${RuntimeGlobals.publicPath} = ${
                  isEntry ? publicPathEval : defaultPublicPath
                };`;
              }
            } as any)('runtime-path-module')
          );

          // вернуть true чтобы не вызывалась логика по умолчанию
          return true;
        });
    });
  }
}
