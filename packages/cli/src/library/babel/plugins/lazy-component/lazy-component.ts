import type { NodePath } from '@babel/traverse';
import type { CallExpression, Import } from '@babel/types';
import type { Plugin } from '../types.h';
import { resolveMethod } from './properties/resolve';
import { requireSyncMethod } from './properties/requireSync';
import { isReadyMethod } from './properties/isReady';
import { importAsyncMethod } from './properties/importAsync';
import { requireAsyncMethod } from './properties/requireAsync';
import { chunkNameMethod } from './properties/chunkName';

interface InnerState {
  tramvaiReactLazyLocal: string;
}

export const lazyComponentPlugin: Plugin<InnerState> = (api) => {
  const { types: t } = api;

  return {
    pre() {
      this.tramvaiReactLazyLocal = null;
    },
    visitor: {
      // находим импорты `import { lazy } from '@tramvai/react'` т.к. будем преобразовывать импорты только для них
      ImportDeclaration(path) {
        if (path.get('source').node.value === '@tramvai/react') {
          const specifiers = path.get('specifiers');

          for (const specifier of specifiers) {
            if (
              t.isImportSpecifier(specifier.node) &&
              t.isIdentifier(specifier.node.imported) &&
              specifier.node.imported.name === 'lazy'
            ) {
              // учитываем что локальная переменная в файле может быть названа по-другому
              this.tramvaiReactLazyLocal = specifier.node.local.name;
              break;
            }
          }
        }
      },
      CallExpression(path) {
        if (!this.tramvaiReactLazyLocal) {
          // если импорт lazy не был найден, то нет смысла работать с файлом дальше
          return;
        }

        // проверяет только вызовы lazy
        if (path.get('callee').isIdentifier({ name: this.tramvaiReactLazyLocal })) {
          const imports: NodePath<Import>[] = [];

          // ищем импорты внутри вызова lazy
          path.traverse({
            Import(importPath) {
              imports.push(importPath);
            },
          });

          // локальное имя для lazy из @tramvai/react
          const lazyCallPath = path;
          // ссылка на функцию, которая была передана в lazy
          const funcPath = lazyCallPath.get('arguments')[0];

          if (!funcPath.isFunctionExpression() && !funcPath.isArrowFunctionExpression()) {
            return;
          }

          const properties = [
            chunkNameMethod,
            requireSyncMethod,
            isReadyMethod,
            importAsyncMethod,
            requireAsyncMethod,
            resolveMethod,
          ].map((init) => init(api));

          // ссылка на вызов импорта - чтобы можно было получить аргументы импорта
          const importPath = imports[0].parentPath as NodePath<CallExpression>;
          const opts = { lazyCallPath, funcPath, importPath };

          funcPath.replaceWith(t.objectExpression(properties.map((factory) => factory(opts))));
        }
      },
    },
  };
};

export default lazyComponentPlugin;
