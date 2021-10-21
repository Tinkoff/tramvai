import { registerMethods } from 'jscodeshift';

import {
  addImport,
  removeImport,
  findImport,
  renameImportSource,
  renameRequireSource,
  renameImportSpecifier,
} from './import';

export const register = () => {
  registerMethods({
    addImport,
    removeImport,
    findImport,
    renameImportSource,
    renameImportSpecifier,
    renameRequireSource,
  });
};
