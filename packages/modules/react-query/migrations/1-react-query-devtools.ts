// eslint-disable-next-line import/no-extraneous-dependencies
import type { Api } from '@tramvai/tools-migrate';

const selfPackageJSON = require('../package.json');

const reactQueryModulePkgIdentifier = '@tramvai/module-react-query';
const reactQueryDevtoolsModuleIdentifier = '@tramvai/module-react-query-devtools';
const reactQueryDevtoolsModuleSpecifier = 'ReactQueryDevtoolsModule';

// eslint-disable-next-line import/no-default-export
export default async (api: Api) => {
  await api.transform(({ source }, { j }, { printOptions }) => {
    const parsed = j(source);
    let hasChanged = false;

    parsed
      .find(j.ImportDeclaration, { source: { value: reactQueryModulePkgIdentifier } })
      .forEach((importDeclaration) => {
        // eslint-disable-next-line no-param-reassign
        importDeclaration.value.specifiers = importDeclaration.value.specifiers?.filter(
          (specifier) => {
            if ('imported' in specifier) {
              if (specifier.imported.name === reactQueryDevtoolsModuleSpecifier) {
                parsed.addImport(
                  j.importDeclaration(
                    [j.importSpecifier(j.identifier(reactQueryDevtoolsModuleSpecifier))],
                    j.stringLiteral(reactQueryDevtoolsModuleIdentifier)
                  )
                );
                hasChanged = true;
                return false;
              }
              return true;
            }
            return true;
          }
        );
      });

    if (hasChanged) {
      return parsed.toSource(printOptions);
    }
  });

  const packageJSON = api.packageJSON.source;

  if (!packageJSON.dependencies?.[reactQueryDevtoolsModuleIdentifier]) {
    packageJSON.dependencies![reactQueryDevtoolsModuleIdentifier] =
      selfPackageJSON.dependencies['@tramvai/core'];
  }
};
