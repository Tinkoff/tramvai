import type { Results } from 'depcheck';
import type { CollectorInterface, Package } from '@tinkoff-monorepo/pkgs-collector';

export { CollectorInterface, Package } from '@tinkoff-monorepo/pkgs-collector';

export type CheckResults = Results & { mismatched?: string[] };

export type Config = {
  ignorePeerDependencies?: string[];
  ignorePatterns?: string[];
  ignoreUnused?: string[];
  fix?: boolean;
  depcheck?: DepcheckConfig;
  collector: CollectorInterface['collect'];
  [key: string]: any;
};

export type DepcheckConfig = {
  ignoreDirs: string[];
  ignoreMatches: string[];
  skipMissing: boolean;
  ignoreBinPackage: boolean;
};

export type Checker = (allPkgs: Package[], pkg: Package, res: CheckResults, config: Config) => void;
