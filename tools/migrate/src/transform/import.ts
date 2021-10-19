import type { ASTPath, Collection, StringLiteral } from 'jscodeshift';
import { Identifier } from 'jscodeshift';
import { identifier } from 'jscodeshift';
import { stringLiteral } from 'jscodeshift';
import { callExpression } from 'jscodeshift';
import {
  ImportSpecifier,
  ImportDeclaration,
  Program,
  literal,
  importDeclaration,
  CallExpression,
} from 'jscodeshift';

const isRequireExpression = (path: ASTPath<CallExpression>) =>
  path &&
  path.value &&
  path.value.callee &&
  path.value.callee.type === 'Identifier' &&
  path.value.callee.name === 'require';

/**
 * @description
 *  Adds import declaration with following rules:
 *  - if it is not exist in ast - add it
 *  - if import from the same package exists - add only missing specifiers
 *  - if same imports already exists do nothing
 * @param importDeclaration jscodeshift ast type
 * @returns true if any changes to ast were made, false - otherwise
 */
export function addImport<N>(this: Collection<N>, importDeclaration: ImportDeclaration) {
  const imports = this.find(ImportDeclaration);

  if (imports.length) {
    const sourceImport = imports.filter(
      (declaration) => declaration.node.source.value === importDeclaration.source.value
    );
    const sourceImportNode = sourceImport.nodes()[0];

    if (sourceImport.length) {
      importDeclaration.specifiers.forEach((specifier) => {
        const name =
          specifier.local?.name ??
          (specifier.type === 'ImportSpecifier' ? specifier.imported.name : specifier.local.name);
        let hasChanged = false;

        if (!sourceImport.find(ImportSpecifier, { local: { name } }).length) {
          sourceImportNode.specifiers.push(specifier);
          hasChanged = true;
        }

        return hasChanged;
      });
    } else {
      imports.at(0).insertBefore(importDeclaration);
    }
  } else {
    this.find(Program).get('body', 0).insertBefore(importDeclaration);
  }

  return true;
}

/**
 * @description
 *  Replace source string for the imports
 */
export function renameImportSource(this: Collection, from: string, to: string) {
  const imports = this.find(ImportDeclaration).filter((imp) => {
    return `${imp.node.source.value}`.startsWith(from);
  });

  if (!imports.length) {
    return false;
  }

  const regexp = new RegExp(`^${from}`);
  imports.replaceWith((imp) => {
    const val = imp.node.source.value;

    return importDeclaration(imp.value.specifiers, literal(`${val}`.replace(regexp, to)));
  });

  return true;
}

/**
 * @description
 *  Replace import specifiers for the imports
 */
export function renameImportSpecifier(this: Collection, source: string, from: string, to: string) {
  const imports = this.find(ImportDeclaration, { source: { value: source } });

  if (!imports.length) {
    return false;
  }

  let shouldRename = false;
  imports.replaceWith((imp) => {
    const specifiers = imp.value.specifiers.map((specifier) => {
      if ('imported' in specifier && specifier.imported.name === from) {
        shouldRename = specifier.imported.name === specifier.local.name;

        return { ...specifier, imported: identifier(to) };
      }

      return specifier;
    });

    return importDeclaration(specifiers, imp.value.source);
  });

  if (shouldRename) {
    this.find(Identifier, { name: from }).replaceWith(identifier(to));
  }

  return true;
}

/**
 * @description
 *  Replace source string for the `require` calls
 */
export function renameRequireSource(this: Collection, from: string, to: string) {
  const imports = this.find(CallExpression).filter((exp) => {
    return (
      isRequireExpression(exp) &&
      exp.value.arguments[0].type === 'StringLiteral' &&
      `${exp.value.arguments[0].value}`.startsWith(from)
    );
  });

  if (!imports.length) {
    return false;
  }

  const regexp = new RegExp(`^${from}`);
  imports.replaceWith((exp) => {
    const val = (exp.value.arguments[0] as StringLiteral).value;

    return callExpression(exp.value.callee, [stringLiteral(`${val}`.replace(regexp, to))]);
  });

  return true;
}
