import type { ConfigEntry } from './common';

export interface PackageConfigEntry extends ConfigEntry {
  type: 'package';
  /**
   * @title Package name
   */
  name: string;
  /**
   * @title Package root folder (need to contain `package.json`, `tsconfig.json` and `src` folder with source code)
   */
  root: string;
}
