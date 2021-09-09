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

    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.runtimeRequirementInTree
        .for(RuntimeGlobals.publicPath)
        .tap(PLUGIN_NAME, (chunk) => {
          compilation.addRuntimeModule(
            chunk,
            new (class extends RuntimeModule {
              generate() {
                // проставлем свой publicPath
                return `${RuntimeGlobals.publicPath} = ${publicPathEval};`;
              }
            } as any)('runtime-path-module')
          );

          // вернуть true чтобы не вызывалась логика по умолчанию
          return true;
        });
    });
  }
}
