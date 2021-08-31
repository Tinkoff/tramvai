import { extname } from 'path';
import type { Plugin } from 'rollup';
import { createFilter } from 'rollup-pluginutils';
import { walk } from 'estree-walker';
import MagicString from 'magic-string';

interface Options {
  include?: string[];
  exclude?: string[];
  extensions?: string[];
}

const DEFAULT_OPTIONS: Required<Options> = {
  include: ['*.+(t|j)s+(|x)', '**/*.+(t|j)s+(|x)'], // анализируем только tsx? и jsx? файлы по умолчанию
  exclude: ['*.d.ts', '**/*.d.ts'],
  extensions: ['ts', 'tsx', 'json'],
};

export const addRequireChunkPlugin = (options: Options = {}): Plugin => {
  const opts: Options = {
    ...DEFAULT_OPTIONS,
    ...options,
  };
  const filter = createFilter(opts.include, opts.exclude);

  return {
    name: 'add-require-chunk',

    transform(code, id) {
      if (!filter(id)) {
        return null; // null - прокинуть дальше выполнение других плагинов
      }

      const ast = this.parse(code, {});
      const magicString = new MagicString(code);

      const promises: Array<Promise<void>> = [];

      walk(ast as any, {
        enter: (node) => {
          // проверяем только вызовы require
          if (
            node.type === 'CallExpression' &&
            node.callee.name === 'require' &&
            node.arguments[0].type === 'Literal'
          ) {
            const arg = node.arguments[0];
            const name = arg.value; // строка-аргумент переданная в require

            // this.resolve вернет модуль относительно текущего файла
            promises.push(
              this.resolve(name, id).then((module) => {
                // external: false обозначает внутренние модули которые нужно добавить в бандл
                if (
                  module &&
                  !module.external &&
                  opts.extensions.includes(extname(module.id).slice(1))
                ) {
                  // добавляет отдельный чанк в результат сборки, имя настраивается параметром chunkFileNames
                  // возвращает специальную строку через которую позже можно будет получить инфу о файле
                  const referenceId = this.emitFile({
                    type: 'chunk',
                    id: module.id,
                  });

                  // переписываем изначальную строку на специальный плейсхолдер,
                  // который позже будет использован в хуке resolveFileUrl
                  magicString.overwrite(
                    arg.start,
                    arg.end,
                    `import.meta.ROLLUP_FILE_URL_${referenceId}`
                  );
                }
              })
            );
          }
        },
      });

      return Promise.all(promises).then(() => {
        return { code: magicString.toString() };
      });
    },

    resolveFileUrl({ referenceId, fileName }) {
      if (referenceId) {
        // вместо плейсхолдера import.meta.ROLLUP_CHUNK_URL_ подставить имя сгенерированного файла
        return `'./${fileName}'`;
      }

      return null;
    },
  };
};
