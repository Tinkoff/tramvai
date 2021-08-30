import type { ConfigEntry } from './common';

export interface ModuleBuild {
  /**
   * @default {}
   */
  options?: {
    /**
     * @title Path to build module assets
     * @default "dist/modules"
     */
    output?: string;
  };
  /**
   * @default {}
   */
  configurations?: ConfigEntry['commands']['build']['configurations'] & {
    /**
     * @default {"config": "postcss.config", "cssLocalIdentName": "[hash:base64:5]"}
     */
    postcss?: ConfigEntry['commands']['build']['configurations']['postcss'];
  };
}

export interface ModuleConfigEntry extends ConfigEntry {
  type: 'module';
  /**
   * @default {}
   */
  commands?: {
    /**
     * @default {}
     */
    build?: ModuleBuild;
    /**
     * @default {}
     */
    serve?: ConfigEntry['commands']['serve'];
  };
}
