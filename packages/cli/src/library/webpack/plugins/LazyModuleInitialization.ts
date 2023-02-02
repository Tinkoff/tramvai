import type { Compiler, LibraryOptions } from 'webpack';
import { library, sources } from 'webpack';
// @ts-ignore
// eslint-disable-next-line no-restricted-imports
import ExportPropertyLibraryPlugin from 'webpack/lib/library/ExportPropertyLibraryPlugin';

export default class LazyModuleInitialization extends library.AbstractLibraryPlugin<{
  name: string;
}> {
  constructor() {
    super({
      pluginName: 'LazyModuleInitialization ',
      type: 'lazy',
    });
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

  render(
    source: sources.Source,
    context: unknown,
    { options: { name } }: { options: { name: string } }
  ) {
    // оборачиваем код модуля в lazy-обёртку
    return new sources.ConcatSource(
      'window.__externals = window.__externals || {};\n',
      `Object.defineProperty(window.__externals, "${name}", { get: function() {\n`,
      `var module = `,
      source,
      ';\n',
      `Object.defineProperty(window.__externals, "${name}", { value: module });\n`,
      'return module; }\n',
      ', configurable: true })'
    );
  }
}
