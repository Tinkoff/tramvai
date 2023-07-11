import type { Configuration } from 'webpack';
import type { DeduplicateStrategy } from '@tinkoff/webpack-dedupe-plugin';
import type { ConfigEntry, OverridableOption } from './common';

type Notifications = {
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

export type WebpackExperiments = Omit<
  Configuration['experiments'],
  'buildHttp' | 'lazyCompilation' | 'css'
> & {
  /**
   * @title Enable additional in-memory caching of modules which are unchanged and reference only unchanged modules.
   * @default true
   */
  cacheUnaffected: boolean;
  /**
   * @title Enable backward compatibility with webpack previous major versions
   * @default false
   */
  backCompat: boolean;
};

export type MinicssExperiments = {
  /**
   * @title Use a new webpack API to execute modules instead of child compilers. This improves performance and memory usage a lot.
   * @default true
   */
  useImportModule: OverridableOption<boolean>;
};

export type TranspilationExperiments = {
  /**
   * @title specify loader to transpile js-ts code
   * @default "babel"
   */
  loader: OverridableOption<'babel' | 'swc'>;
};

export interface Experiments {
  /**
   * @title experiments configuration for [webpack](https://webpack.js.org/configuration/experiments/)
   * @default {}
   */
  webpack: WebpackExperiments;
  /**
   * @title experimental settings for [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)
   * @default {}
   */
  minicss: MinicssExperiments;

  /**
   * @title experimental settings for code transpilation
   * @default {}
   */
  transpilation: TranspilationExperiments;
}

/**
 * @default {}
 * @additionalProperties true
 */
type Define = Record<string, string>;

/**
 * @tutorial
 * - Common properties that are defined in the tramvai.json config file
 * - These properties are later used to generate the json-schema
 * - Although, some of the marked as required in typings they are anyway converted to optional
 * while generating schema
 * - you can provide default value with "@default" jsdoc in order to replace with default on schema validation
 * - if you provide default value with "@default" mark the property as required to easier its usage in cli code
 * - if the option doesn't have a default value mark it as optional to properly handle this case in cli code
 * - to specify option that might be overridden for dev/prod environments specify its type as `OverridableOption<T>`. You can
 * provide the default value either as single value (will be used in both envs) or in the form of { development: T, production: T } (to be able to
 * provide defaults for all of the envs)
 * - do not use `OverridableOption<T>` with complex types that has internal properties with "@default" as that defaults will not be set by ajv
 */
export interface CliConfigEntry extends ConfigEntry {
  /**
   * @title Enable source maps
   * @default false
   */
  sourceMap: OverridableOption<boolean>;
  /**
   * @title Change different experimental cli settings
   * @default {}
   */
  experiments: Experiments;
  /**
   * @title List of modules to exclude from `@babel/preset-env`
   * @description Option doesn't affect build with swc loader
   */
  excludesPresetEnv?: string[];
  /**
   * @title Webpack's thread-loader config
   * @additionalProperties true
   */
  threadLoader?: Record<string, unknown>;
  /**
   * @title Define static variables that should be replaced by name with provided value
   * @default {}
   */
  define: {
    shared: Define;
    development: Define;
    production: Define;
  };
  /**
   * @title `@deprecated` will be removed in next major release.
   * @default false
   */
  generateDataQaTag: boolean;
  /**
   * @title `@deprecated` will be removed in next major release. Включает использование плагина fill-action-name
   * @default false
   */
  enableFillActionNamePlugin: boolean;
  /**
   * @default {}
   */
  postcss: {
    /**
     * @title Path to postcss config file. By default, `postcss.config.js` file is used
     */
    config?: string;
    /**
     * @title CSS identifiers build algorithm
     */
    cssLocalIdentName?: OverridableOption<string>;
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
   * @title `@deprecated` as cli now supports baseUrl and paths from the app's tsconfig.json file.
   * Just check or add configuration to your tsconfig file and remove alias from tramvai.json
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
    plugins?: Array<any>;
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
  transpileOnlyModernLibs: boolean;
  /**
   * @title Webpack specific settings
   * @default {}
   */
  webpack: {
    /**
     * @title Browser package resolve aliases. E.g. { "stream": "stream-browserify" }
     * @additionalProperties true
     */
    resolveAlias?: Record<string, string>;
    /**
     * @title Browser packages to provide with ProvidePlugin. E.g. { "Buffer": ["buffer", "Buffer"] }
     * @additionalProperties true
     */
    provide?: Record<string, any>;
    /**
     * @title Configure https://webpack.js.org/configuration/watch/#watchoptions
     * @description For OSX users and big projects it's recommended to enable watch polling, e.g. `{ poll: 1000 }`, more info - https://github.com/webpack/watchpack/issues/222
     */
    watchOptions?: Configuration['watchOptions'];
  };

  // options that affect only production builds
  /**
   * @title Enable DedupePlugin
   * @default {}
   */
  dedupe: {
    /**
     * @title Strategy for DedupePlugin
     * @default true
     */
    enabled: boolean;
    /**
     * @title Does DedupePlugin should be enabled in development mode
     * Why it might be useful see [issue](https://github.com/Tinkoff/tramvai/issues/11)
     * @default false
     */
    enabledDev: boolean;
    /**
     * @title Strategy for DedupePlugin
     * @default "equality"
     */
    strategy: DeduplicateStrategy;
    /**
     * @title Sets ignore to DedupePlugin
     */
    ignore?: string[];
  };
  /**
   * @title terser settings
   * @default {}
   */
  terser: {
    /**
     * @title Configuration for enabling parallel compression for terser plugin
     * @default true
     */
    parallel: boolean;
  };
  /**
   * @title Set minimizer for css
   * @default "css-minimizer"
   */
  cssMinimize: 'csso' | 'css-minimizer';

  // options that affect only development builds

  /**
   * @title React hot-refresh
   * @default {}
   */
  hotRefresh: {
    /**
     * @title Enable react hot-refresh
     * @default true
     */
    enabled?: boolean;
    /**
     * @title Configure react hot-refresh https://github.com/pmmmwh/react-refresh-webpack-plugin#options
     * @default {}
     */
    options?: {
      /**
       * @default false
       */
      overlay?: boolean | Record<string, any>;
      [key: string]: any;
    };
  };
  /**
   * @title Controls build notifications settings during development
   * @default {}
   */
  notifications: Notifications & {
    client?: Notifications;
    server?: Notifications;
  };
  /**
   * @title Specify dependencies that will be shared between application and child-apps
   * @description Properly defining that dependencies may greatly reduce filesize of loaded js on the client
   * @default {}
   */
  shared: {
    /**
     * @title Should default dependencies list be added to shared list
     * @description It includes the list of commonly used dependencies in the child-apps
     * By default, it is enabled in application in case of tramvai/module-child-app is specified in package.json
     * and for child-apps
     */
    defaultTramvaiDependencies?: boolean;
    /**
     * @title add caret range specifier for tramvai dependencies
     * @description minimal versions are inferred from package.json
     * @default true
     */
    flexibleTramvaiVersions: boolean;
    /**
     * @title list of the dependencies that will be shared
     * @default []
     */
    deps: Array<
      | string
      | {
          /**
           * @title name of the dependency import
           */
          name: string;
          /**
           * @title if dependency is marked as singleton the dependency will be initialized only once and will not be updated
           * @description Do not overuse that feature as it may lead to subtle bugs in case of different versions on different sides
           * @default: false
           */
          singleton: boolean;
        }
    >;
  };
}
