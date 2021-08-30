import type { ASTPath, CallExpression, Collection } from 'jscodeshift';
import { ImportDeclaration, Program } from 'jscodeshift';
import type { PackageJSON } from './types';

export const isRequireExpression = (path: ASTPath<CallExpression>) =>
  path &&
  path.value &&
  path.value.callee &&
  path.value.callee.type === 'Identifier' &&
  path.value.callee.name === 'require';

export const addImport = (parsedSource: Collection, importDeclaration: ImportDeclaration) => {
  const firstImport = parsedSource.find(ImportDeclaration).at(0);

  if (firstImport.length) {
    firstImport.insertBefore(importDeclaration);
  } else {
    parsedSource.find(Program).get('body', 0).insertBefore(importDeclaration);
  }
};

export const replaceDependency = ({
  packageJSON,
  from,
  to,
}: {
  packageJSON: PackageJSON;
  from: string;
  to?: [string, string];
}) => {
  const deps = packageJSON.dependencies;
  const devDeps = packageJSON.devDependencies;
  const [key, value] = to || [];

  if (deps) {
    if (deps[from]) {
      // eslint-disable-next-line no-param-reassign
      delete packageJSON.dependencies[from];

      if (key && !deps[key]) {
        // eslint-disable-next-line no-param-reassign
        packageJSON.dependencies[key] = value;
      }
    }
  }

  if (devDeps) {
    if (devDeps[from]) {
      // eslint-disable-next-line no-param-reassign
      delete packageJSON.devDependencies[from];

      if (key && !devDeps[key]) {
        // eslint-disable-next-line no-param-reassign
        packageJSON.devDependencies[key] = value;
      }
    }
  }
};
