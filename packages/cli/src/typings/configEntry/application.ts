// eslint-disable-next-line no-restricted-imports
import type { ForkTsCheckerWebpackPluginOptions } from 'fork-ts-checker-webpack-plugin/lib/ForkTsCheckerWebpackPluginOptions';
import type { CliConfigEntry, Experiments } from './cli';
import type { OverridableOption } from './common';

export interface CheckAsyncTsConfig {
  /**
   * при включении этого флага в build-сборку добавляется проверка типов
   * при невалидных типах сборка падает
   */
  failOnBuild?: boolean;
  /**
   * дополнительные опции
   * @link https://github.com/TypeStrong/fork-ts-checker-webpack-plugin
   */
  pluginOptions?: Partial<ForkTsCheckerWebpackPluginOptions>;
}

export interface ApplicationExperiments extends Experiments {
  /**
   * @title How to run server build
   * @default "process"
   */
  serverRunner?: 'process' | 'thread';
}

export interface ApplicationConfigEntry extends CliConfigEntry {
  type: 'application';
  /**
   * @title Path to polyfill file. By default, looks for the `src/polyfill`
   */
  polyfill?: string;
  /**
   * @title Path to folder with papi handlers
   * @default "src/api"
   */
  serverApiDir: string;
  /**
   * @title Controls the cli output locations
   * @default {}
   */
  output: {
    /**
     * @title Path to build assets for server
     * @default "dist/server"
     */
    server: string;
    /**
     * @title Path to build assets for client
     * @default "dist/client"
     */
    client: string;
    /**
     * @title Path to build static assets
     * @default "dist/static"
     */
    static: string;
  };
  /**
   * @title Enable build for modern browsers
   * @default true
   */
  modern?: boolean;

  /**
   * @title File-System Routing feature
   * @default {}
   */
  fileSystemPages: {
    /**
     * @title Read pages from file system
     * @default false
     */
    enabled: boolean;
    /**
     * @title Folder with pages from which static routers are generated
     * @default "routes"
     */
    routesDir: string | false;
    /**
     * @title Folder with components which can be manually added to static routers
     * @default "pages"
     */
    pagesDir: string | false;
  };
  /**
   * @title Configure the options on webpack splitChunks
   * @default {}
   */
  splitChunks: {
    /**
     * @default "granularChunks"
     */
    mode: 'granularChunks' | 'commonChunk' | false;
    /**
     * @title Move module to shared chunk if used at least as many times in other chunks
     * @default 2
     */
    granularChunksSplitNumber: number;
    /**
     * @title Minimum shared chunk size in bytes
     * @default 20000
     */
    granularChunksMinSize: number;
    /**
     * @title `@deprecated will be removed in next major release` Move module to common chunk if used at least as many times in other chunks
     * @default 3
     */
    commonChunkSplitNumber: number;
  };
  /**
   * @title Configuration for fork-ts-checker-webpack-plugin
   * @default false
   */
  checkAsyncTs: boolean | CheckAsyncTsConfig;

  /**
   * @title Pass list to Webpack config externals field
   * @default []
   */
  externals: OverridableOption<string[]>;
  /**
   * @title Experimental settings
   * @default {}
   */
  experiments: ApplicationExperiments;
}
