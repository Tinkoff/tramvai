import uniq from '@tinkoff/utils/array/uniq';

export type PackageJSON = {
  name: string;
  version: string;
  main: string;
  typings: string;
  browser?: string | Record<string, string>;
  module?: string;
  es2017?: string;
  files?: string[];
  [key: string]: any;
};

export const normalizeFilenameForBrowserObjectField = (name: string): string => {
  return name.startsWith('./') ? name : `./${name}`;
};

export const mergeFiles = (packageJson: PackageJSON, files: string[]) => {
  return uniq([...(packageJson.files ?? []), ...files]);
};
