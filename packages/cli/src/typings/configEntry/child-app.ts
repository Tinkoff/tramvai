import type { ConfigEntry } from './common';

export interface ChildAppBuild {
  /**
   * @default {}
   */
  options?: {
    /**
     * @title Path to build module assets
     * @default "dist/child-app"
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

export interface ChildAppConfigEntry extends ConfigEntry {
  type: 'child-app';
  /**
   * @default {}
   */
  commands?: {
    /**
     * @default {}
     */
    build?: ChildAppBuild;
    /**
     * @default {}
     */
    serve?: ConfigEntry['commands']['serve'];
  };
}
