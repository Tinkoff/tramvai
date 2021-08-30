import type { Transform, FileInfo } from 'jscodeshift';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Options as RecastOptions } from 'recast';
// eslint-disable-next-line import/no-extraneous-dependencies, no-restricted-imports
import type { Config } from '@tramvai/cli/lib/typings/projectType';

declare module 'jscodeshift' {
  export interface Options {
    printOptions?: RecastOptions;
  }
}

export type Transformer = Transform;
export type PathTransformer = (file: FileInfo) => string;

export type PackageJSON = Record<string, any>;
export type TramvaiJSON = Config;

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
