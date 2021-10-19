import type { Transform, FileInfo } from 'jscodeshift';
import type { Options as RecastOptions } from 'recast';

import type {
  addImport,
  renameImportSource,
  renameRequireSource,
  renameImportSpecifier,
} from './transform/import';

declare module 'jscodeshift/src/Collection' {
  export interface Collection<N> {
    addImport: typeof addImport;
    renameImportSource: typeof renameImportSource;
    renameImportSpecifier: typeof renameImportSpecifier;
    renameRequireSource: typeof renameRequireSource;
  }
}

declare module 'jscodeshift' {
  export interface Options {
    printOptions?: RecastOptions;
  }
}

export type Transformer = Transform;
export type PathTransformer = (file: FileInfo) => string;

export type PackageJSON = Record<string, any>;
// @todo: как использовать тайпинги CLI без циклической зависимости?
export type TramvaiJSON = {
  projectsConfig?: any;
  $schema?: string;
  projects: { [name: string]: Record<string, any> };
};

export interface Api {
  packageJSON: {
    source: PackageJSON;
    path: string;
  };
  tramvaiJSON: {
    source: TramvaiJSON;
    path: string;
  };
  transform: (transformer: Transformer, pathTransformer?: PathTransformer) => Promise<void>;
}

export interface AppliedInfo {
  package?: {
    [packageName: string]: {
      migrations?: string[];
    };
  };
}
