import type { CliConfigEntry } from './cli';

export interface ChildAppConfigEntry extends CliConfigEntry {
  type: 'child-app';
  /**
   * @title Path to build module assets
   * @default "dist/child-app"
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
