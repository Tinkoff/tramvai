// eslint-disable-next-line import/no-extraneous-dependencies
import type { ASTPath, ImportDeclaration, ObjectExpression } from 'jscodeshift';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Api } from '@tramvai/tools-migrate';
// eslint-disable-next-line import/no-extraneous-dependencies, no-restricted-imports
import { replaceDependency } from '@tramvai/tools-migrate/lib/dependency';

const selfPackageJSON = require('../package.json');

const COMPLEX_OPTIONS = {
  key: `
  Заменить пожалуйста текущий импортируемый файл, на файл откуда экспортируется асинхронный компонент через default, т.к. @tramvai/react поддерживает только default
Если заменить в исходном файле нельзя, то можно просто создать файл-обёртку, который реэкспортнет нужный ключ через export default,
затем уберите эту опцию
`,
};

const REMOVE_OPTIONS = new Set(['ignoreBabelRename']);

// eslint-disable-next-line import/no-default-export
export default async ({ packageJSON, transform }: Api) => {
  await transform(({ source }, { j }, { printOptions }) => {
    const parsed = j(source);
    let tramvaiReactImport: ASTPath<ImportDeclaration> | undefined;
    let lazyImportName = '';
    let legacyImportName = '';
    let hasLegacyImport = false;

    parsed.find(j.ImportDeclaration).forEach((imp) => {
      switch (imp.node.source.value) {
        case '@tramvai/react':
          tramvaiReactImport = imp;
          imp.node.specifiers.forEach((specifier) => {
            if (specifier.type === 'ImportSpecifier') {
              if (specifier.imported.name === 'lazy') {
                lazyImportName = specifier.local!.name;
                legacyImportName = lazyImportName;
              }
            }
          });

          break;
        case '@tinkoff/platform-legacy/utils/decorators/asyncUniversal':
        case 'react-universal-component':
          hasLegacyImport = true;
          imp.node.specifiers.forEach((specifier) => {
            if (specifier.type === 'ImportDefaultSpecifier') {
              legacyImportName = specifier.local!.name;
            }
          });

          imp.replace();

          break;
      }
    });

    if (!legacyImportName) {
      return;
    }

    if (hasLegacyImport) {
      if (tramvaiReactImport) {
        if (!lazyImportName) {
          lazyImportName = 'lazy';
          tramvaiReactImport.node.specifiers.push(j.importSpecifier(j.identifier('lazy')));
        }
      } else {
        lazyImportName = 'lazy';
        parsed.addImport(
          j.importDeclaration(
            [j.importSpecifier(j.identifier('lazy'))],
            j.stringLiteral('@tramvai/react')
          )
        );
      }
    }

    replaceDependency({
      packageJSON: packageJSON.source,
      from: 'react-universal-component',
    });

    // eslint-disable-next-line no-param-reassign
    packageJSON.source.dependencies['@tramvai/react'] = selfPackageJSON.version;

    parsed
      .find(j.CallExpression, {
        callee: {
          name: legacyImportName,
        },
      })
      .replaceWith((p) => {
        const [imp, opts] = p.node.arguments;

        let migratedOps: typeof opts = opts;

        if (opts && opts.type === 'ObjectExpression') {
          const props: ObjectExpression['properties'] = [];

          for (const prop of opts.properties) {
            if (prop.type === 'ObjectProperty' && prop.key.type === 'Identifier') {
              if (REMOVE_OPTIONS.has(prop.key.name)) {
                continue;
              }

              if (prop.key.name in COMPLEX_OPTIONS) {
                prop.comments = [
                  j.commentBlock(COMPLEX_OPTIONS[prop.key.name as keyof typeof COMPLEX_OPTIONS]),
                ];
              }
            }

            props.push(prop);
          }

          migratedOps = j.objectExpression(props);
        }

        return j.callExpression(
          j.identifier(lazyImportName),
          [
            imp.type === 'CallExpression' ? j.arrowFunctionExpression([], imp) : imp,
            migratedOps,
          ].filter(Boolean)
        );
      });

    return parsed.toSource(printOptions);
  });
};
