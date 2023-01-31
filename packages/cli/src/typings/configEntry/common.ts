import type { Configuration } from 'webpack';
import type { DeduplicateStrategy } from '@tinkoff/webpack-dedupe-plugin';
import type { ProjectType } from '../projectType';

type ServeNotifications = {
  /**
   * @title Defines when success notifications are shown
   */
  suppressSuccess?: false | true | 'always' | 'initial';
  /**
   * @title True to suppress the warning notifications, otherwise false
   */
  suppressWarning?: boolean;
  /**
   * @title True to activate (focus) the terminal window when a compilation error occurs
   */
  activateTerminalOnError?: boolean;
};

export interface Experiments {
  /**
   * @title experiments configuration for [webpack](https://webpack.js.org/configuration/experiments/)
   * @default {}
   */
  webpack?: Omit<Configuration['experiments'], 'buildHttp' | 'lazyCompilation'> & {
    /**
     * @title Enable additional in-memory caching of modules which are unchanged and reference only unchanged modules.
     * @default true
     */
    cacheUnaffected?: boolean;
    /**
     * @title Enable backward compatibility with webpack previous major versions
     * @default false
     */
    backCompat?: boolean;
  };
  /**
   * @title experimental settings for [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)
   * @default {}
   */
  minicss?: {
    /**
     * @title Use a new webpack API to execute modules instead of child compilers. This improves performance and memory usage a lot.
     * @default true
     */
    useImportModule?: boolean;
  };

  /**
   * @title experimental settings for code transpilation
   * @default {}
   */
  transpilation?: {
    /**
     * @title specify loader to transpile js-ts code
     * @default "babel"
     */
    loader?: 'babel' | 'swc';
  };
}

interface ServeConfig {
  /**
   * @default {}
   */
  notifications?: ServeNotifications & {
    client?: ServeNotifications;
    server?: ServeNotifications;
  };
  /**
   * @default {}
   */
  configurations?: {
    /**
     * @title Enable source maps in development build (for client and server build)
     * @default false
     */
    sourceMap?: boolean;
    /**
     * @title Enable development build for modern browsers
     * @default true
     */
    modern?: boolean;
    /**
     * @title Enable react hot-refresh
     * @default true
     */
    hotRefresh?: boolean;
    /**
     * @title Configure react hot-refresh https://github.com/pmmmwh/react-refresh-webpack-plugin#options
     */
    hotRefreshOptions?: {
      overlay?: boolean | Record<string, any>;
      [key: string]: any;
    };
    /**
     * @title Experimental settings
     * @default {}
     */
    experiments?: Experiments;
  };
}

interface BuildConfig {
  /**
   * @default {}
   */
  options?: Record<string, any>;
  /**
   * @default {}
   */
  configurations?: {
    /**
     * @title Enable production build for modern browsers
     * @default true
     */
    modern?: boolean;
    /**
     * @title Enable DedupePlugin
     * @default "equality"
     */
    dedupe?: DeduplicateStrategy | false;
    /**
     * @title Sets ignore to DedupePlugin
     */
    dedupeIgnore?: string[];
    /**
     * @title Enable replacing `typeof window` expression
     * @default true
     */
    removeTypeofWindow?: boolean;
    /**
     * @title Enable source maps in production build
     * @default false
     */
    sourceMap?: boolean;
    /**
     * @title Enable source maps for server assets in production build
     * @default false
     */
    sourceMapServer?: boolean;
    /**
     * @title Configuration for enabling parallel compression for terser plugin
     * @default true
     */
    terserParallel?: boolean;
    /**
     * @title List of modules to exclude from @babel/preset-env
     */
    excludesPresetEnv?: string[];
    /**
     * @title thread-loader config
     * @additionalProperties true
     */
    threadLoader?: Record<string, any>;
    /**
     * @title Define plugin config
     * @default {"prod": {}, "dev": {}}
     * @additionalProperties true
     */
    definePlugin?: Record<string, any>;
    /**
     * @deprecated
     *
     * @default false
     */
    generateDataQaTag?: boolean;
    /**
     * @deprecated включает использование плагина fill-action-name
     *
     * @default false
     */
    enableFillActionNamePlugin?: boolean;
    /**
     * @title Set minimizer for css
     */
    cssMinimize?: 'csso';
    postcss?: {
      /**
       * @title Path to postcss config file
       */
      config?: string;
      /**
       * @title CSS identifiers build algorythm
       */
      cssLocalIdentName?: string;
      /**
       * @title CSS identifiers build algorythm for development buld
       */
      cssLocalIdentNameDev?: string;
      /**
       * @title CSS identifiers build algorythm for production build
       */
      cssLocalIdentNameProd?: string;
      /**
       * @title Path to postcss config file for assets
       */
      assetsConfig?: string;
      /**
       * @title Enable CSS modules for all files matching /RegExp/i.test(filename) regexp.
       */
      cssModulePattern?: string;
    };
    /**
     * @title `@@deprecated @tramvai/cli now supports baseUrl and paths from the app's tsconfig.json file.
     * Just check or add configuration to your tsconfig file and remove alias from tramvai.json`
     * @deprecated
     * @additionalProperties true
     */
    alias?: Record<string, any>;
    /**
     * @title svgo-loader options
     */
    svgo?: {
      /**
       * @title svgo plugins
       */
      plugins?: Record<string, any>[];
    };
    /**
     * @title Settings for image-webpack-loader
     */
    imageOptimization?: {
      /**
       * @title Enable image-webpack-loader
       */
      enabled?: boolean;
      /**
       * @title Pass options to image-webpack-loader
       * @additionalProperties true
       */
      options?: Record<string, any>;
    };
    /**
     * @title transpile libs based only on %40tinkoff/is-modern-lib
     * @default true
     */
    transpileOnlyModernLibs?: boolean;
    /**
     * @title Browser package resolve aliases. E.g. { "stream": "stream-browserify" }
     * @additionalProperties true
     */
    webpackResolveAlias?: Record<string, string>;
    /**
     * @title Browser packages to provide with ProvidePlugin. E.g. { "Buffer": ["buffer", "Buffer"] }
     * @additionalProperties true
     */
    webpackProvide?: Record<string, any>;

    /**
     * @title experimental settings for File-System Routing feature
     * @default {}
     */
    fileSystemPages?: {
      /**
       * @title Read pages from file system
       * @default false
       */
      enable?: boolean;
      /**
       * @title Folder with pages from which static routers are generated
       * @default "routes"
       */
      routesDir?: string | false;
      /**
       * @title Folder with components which can be manually added to static routers
       * @default "pages"
       */
      pagesDir?: string | false;
    };
    /**
     * @title Experimental settings
     * @default {}
     */
    experiments?: Experiments;
  };
}

export interface ConfigEntry {
  name: string;
  root: string;
  type: ProjectType;
  version?: string;
  /**
   * @default {}
   */
  commands?: {
    /**
     * @default {}
     */
    build?: BuildConfig;
    /**
     * @default {}
     */
    serve?: ServeConfig;
  };
}
