import type { ConfigEntry, Experiments } from './common';
import type { CheckAsyncTsConfig } from './CheckAsyncTsConfig';

export interface ApplicationBuild {
  /**
   * @default {}
   */
  options?: {
    /**
     * @title `@deprecated` Vendor is not used anymore
     * @deprecated Vendor is not used anymore
     */
    vendor?: string;
    /**
     * @title Path to polyfill file
     * @default ""
     */
    polyfill?: string;
    /**
     * @title Path to server entry point
     * @default "src/server"
     */
    server?: string;
    /**
     * @title Path to folder with papi handlers
     * @default "src/api"
     */
    serverApiDir?: string;
    /**
     * @title Path to build assets for server
     * @default "dist/server"
     */
    outputServer?: string;
    /**
     * @title Path to build assets for client
     * @default "dist/client"
     */
    outputClient?: string;
    /**
     * @title Path to build static assets
     * @default "dist/static"
     */
    outputStatic?: string;
  };
  /**
   * @default {}
   */
  configurations?: ConfigEntry['commands']['build']['configurations'] & {
    /**
     * @title Separate one common chunk to many small dynamic chunks
     * @default true
     */
    granularChunks?: boolean;
    /**
     * @title Move module to shared chunk if used at least as many times in other chunks
     * @default 2
     */
    granularChunksSplitNumber?: number;
    /**
     * @title Minimum shared chunk size in bytes
     * @default 20000
     */
    granularChunksMinSize?: number;
    /**
     * @title Enable auto chunk splitting (`granularChunks` option alternative)
     * @default false
     */
    commonChunk?: boolean;
    /**
     * @title Move module to common chunk if used at least as many times in other chunks
     * @default 3
     */
    commonChunkSplitNumber?: number;
    /**
     * @title Configuration for fork-ts-checker-webpack-plugin
     * @default false
     */
    checkAsyncTs?: boolean | CheckAsyncTsConfig;
    /**
     * @title Pass list to Webpack config externals field
     * @default []
     */
    externals?: string[];
    /**
     * @default {"config": "postcss.config"}
     */
    postcss?: ConfigEntry['commands']['build']['configurations']['postcss'];
  };
}

export type ApplicationServe = ConfigEntry['commands']['serve'] & {
  /**
   * @default {}
   */
  configurations?: ConfigEntry['commands']['serve']['configurations'] & {
    /**
     * @title Pass list to Webpack config externals field
     * @default ["react$", "react-dom", "prop-types", "express", "core-js"]
     */
    externals?: string[];
    /**
     * @default {}
     */
    experiments?: Experiments & {
      /**
       * @title How to run server build
       * @default "process"
       */
      serverRunner?: 'process' | 'thread';
    };
  };
};

export interface ApplicationConfigEntry extends ConfigEntry {
  type: 'application';
  /**
   * @default {}
   */
  commands?: {
    /**
     * @default {}
     */
    build?: ApplicationBuild;
    /**
     * @default {}
     */
    serve?: ApplicationServe;
  };
}
