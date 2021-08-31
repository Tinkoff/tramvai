import type { RollupOptions, OutputOptions } from 'rollup';
import type { Options } from '../options.h';
import type { PackageJSON } from '../packageJson';

export type BuildParams = { cwd: string; options: Options; packageJSON: PackageJSON };

export type Build = {
  name: string;
  cacheName?: string;
  shouldExecute(params: BuildParams): Promise<boolean>;
  getOptions(params: BuildParams): Promise<{ input: RollupOptions; output: OutputOptions }>;
  modifyPackageJSON?(params: BuildParams): Promise<PackageJSON>;
};
