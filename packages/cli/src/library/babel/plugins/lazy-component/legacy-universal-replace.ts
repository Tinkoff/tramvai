import type { Identifier } from '@babel/types';
import type { Plugin } from '../types.h';

interface InnerState {
  legacyImport: string;
  lazyIdentifier: Identifier;
  file: {
    opts: {
      filename: string;
    };
  };
}

export const legacyUniversalReplace: Plugin<InnerState> = (api) => {
  const { types: t } = api;

  return {
    visitor: {
      // находим импорты `import universal from 'react-universal-component'` или `import async from '/decorators/asyncUniversal`
      ImportDeclaration(path) {
        const { filename } = this.file.opts;

        const isTramvaiReact = /tramvai\/react/.test(filename);

        const { value: source } = path.get('source').node;
        if (
          source === 'react-universal-component' ||
          /\/decorators\/asyncUniversal(\.js)?$/.test(source)
        ) {
          const specifiers = path.get('specifiers');

          if (isTramvaiReact) {
            path.replaceWith(
              t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier('universal'))],
                t.stringLiteral('@loadable/component')
              )
            );

            return;
          }

          for (const specifier of specifiers) {
            if (t.isImportDefaultSpecifier(specifier.node)) {
              this.legacyImport = specifier.node.local.name;
            }
          }

          if (this.legacyImport) {
            const oldImport = path.node;

            this.lazyIdentifier = path.scope.generateUidIdentifier('lazy');

            path.replaceWith(
              t.importDeclaration(
                [t.importSpecifier(this.lazyIdentifier, t.identifier('lazy'))],
                t.stringLiteral('@tramvai/react')
              )
            );

            if (specifiers.length > 1) {
              // возвращаем старый импорт на место, если вдруг используются другие импорты из legacy файла
              path.insertBefore(oldImport);
            }
          }
        }
      },
      CallExpression(path) {
        if (!this.legacyImport) {
          // если импорт не был найден, то нет смысла работать с файлом дальше
          return;
        }

        if (path.get('callee').isIdentifier({ name: this.legacyImport })) {
          const impPath = path.get('arguments')[0];

          if (impPath.isCallExpression() && impPath.get('callee').isImport()) {
            path.replaceWith(
              t.callExpression(this.lazyIdentifier, [t.arrowFunctionExpression([], impPath.node)])
            );
          }
        }
      },
    },
  };
};

export default legacyUniversalReplace;
