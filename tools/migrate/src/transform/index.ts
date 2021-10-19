import { registerMethods } from 'jscodeshift';

import {
  addImport,
  renameImportSource,
  renameRequireSource,
  renameImportSpecifier,
} from './import';

export const register = () => {
  registerMethods({
    addImport,
    renameImportSource,
    renameImportSpecifier,
    renameRequireSource,
  });
};
