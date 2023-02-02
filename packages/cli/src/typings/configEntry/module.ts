import type { CliConfigEntry } from './cli';

export interface ModuleConfigEntry extends CliConfigEntry {
  type: 'module';

  /**
   * @title Path to build module assets
   * @default "dist/modules"
   */
  output: string;
  /**
   * @default {}
   */
  postcss: CliConfigEntry['postcss'] & {
    /**
     * @title CSS identifiers build algorithm
     * @default "[hash:base64:5]"
     */
    cssLocalIdentName?: CliConfigEntry['postcss']['cssLocalIdentName'];
  };
}
