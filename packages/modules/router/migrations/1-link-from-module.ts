// eslint-disable-next-line import/no-extraneous-dependencies
import type { ImportSpecifier } from 'jscodeshift';
import type { Api } from '@tramvai/tools-migrate';

export default async (api: Api) => {
  await api.transform(({ source }, { j }, { printOptions }) => {
    const parsed = j(source);

    const routerLibImport = parsed.find(j.ImportDeclaration, {
      source: { value: '@tinkoff/router' },
    });

    if (routerLibImport) {
      let linkImportSpecifier: ImportSpecifier;

      routerLibImport.forEach((p) => {
        p.node.specifiers?.forEach((specifier) => {
          if ('imported' in specifier && specifier.imported.name === 'Link') {
            linkImportSpecifier = specifier;
          }
        });
      });

      if (linkImportSpecifier) {
        routerLibImport.forEach((p) => {
          // eslint-disable-next-line no-param-reassign
          p.node.specifiers = p.node.specifiers?.filter((specifier) => {
            return !('imported' in specifier && specifier.imported.name === 'Link');
          });

          if (p.node.specifiers?.length === 0) {
            routerLibImport.remove();
          }
        });

        parsed.addImport(
          j.importDeclaration([linkImportSpecifier], j.stringLiteral('@tramvai/module-router'))
        );

        return parsed.toSource(printOptions);
      }
    }
  });
};
