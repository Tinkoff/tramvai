import type { Compiler, LibraryOptions } from 'webpack';
import { library, sources } from 'webpack';
// eslint-disable-next-line no-restricted-imports
import ExportPropertyLibraryPlugin from 'webpack/lib/library/ExportPropertyLibraryPlugin';

export interface LazyLibraryOptions {
  prefix?: string;
}

export class LazyLibraryInitialization extends library.AbstractLibraryPlugin<{
  name: string;
}> {
  private readonly prefix: string;
  constructor({ prefix }: LazyLibraryOptions) {
    super({
      pluginName: 'LazyLibraryInitialization ',
      type: 'lazy',
    });

    this.prefix = prefix ?? '';
  }

  apply(compiler: Compiler) {
    // говорим вебпаку что сами займёмся этим модулем
    library.EnableLibraryPlugin.setEnabled(compiler, 'lazy');
    // указываем что все экспорты из главного файла используются, чтобы вебпак их не вырезал
    new ExportPropertyLibraryPlugin({
      type: 'lazy',
      nsObjectUsed: true,
    }).apply(compiler);
    // вызываем логику абстрактного плагина для либ
    super.apply(compiler);
  }

  parseOptions({ name }: LibraryOptions) {
    if (!name || typeof name !== 'string') {
      throw new Error('Library name must be a non-empty string');
    }

    return {
      name,
    };
  }

  render(source: sources.Source, context, { options: { name } }) {
    // оборачиваем код модуля в lazy-обёртку
    return new sources.ConcatSource(
      `;window["${this.prefix}__" + document.currentScript.src] = (function() {
  var result = {
    exports: null,
    initialized: false,
    initialize: function (require) {
      result.exports =`,
      source,
      `;
      result.initialized = true;
      result.initialize = function (module, ) {
        return result.exports;
      };

      return result.exports;
    }
  };

  return result;
})();
`
    );
  }
}
