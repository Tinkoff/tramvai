import type { Templates } from './questions/template';
import type { PackageManagers } from './questions/packageManager';
import type { TestingFrameworks } from './questions/testingFramework';

export type GeneratingType = 'application' | 'module' | 'package';
export type Params = {
  name: string;
  target: GeneratingType;
  template?: Templates;
  packageManager?: PackageManagers;
  testingFramework?: TestingFrameworks;
};
