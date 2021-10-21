import type { Transform } from 'jscodeshift';
import type { Options as RecastOptions } from 'recast';

import type {
  addImport,
  removeImport,
  findImport,
  renameImportSource,
  renameRequireSource,
  renameImportSpecifier,
} from './transform/import';

declare module 'jscodeshift/src/Collection' {
  export interface Collection<N> {
    addImport: typeof addImport;
    removeImport: typeof removeImport;
    findImport: typeof findImport;
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

export interface FileInfo<T> {
  source: T;
  path: string;
  originSource: T;
  originPath: string;
}

export type JsonFileInfo = FileInfo<Record<string, any>>;
export type SourceFileInfo = FileInfo<string>;

export type SourceFilesInfo = Record<string, SourceFileInfo>;
export type JsonFilesInfo = Record<string, JsonFileInfo>;

export type Transformer = Transform;
export type PathTransformer = (file: FileInfo<any>) => string;

export type PackageJSON = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  [key: string]: any;
};
// @todo: как использовать тайпинги CLI без циклической зависимости?
export type TramvaiJSON = {
  projectsConfig?: any;
  $schema?: string;
  projects: { [name: string]: Record<string, any> };
  migrations?: {
    sourcePattern?: string[];
    ignorePattern?: string[];
  };
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
