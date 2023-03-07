import isNil from '@tinkoff/utils/is/nil';
import isArray from '@tinkoff/utils/is/array';
import isObject from '@tinkoff/utils/is/object';
import prop from '@tinkoff/utils/object/prop';
import mapObj from '@tinkoff/utils/object/map';
import { resolve } from 'path';
import type { BuildType } from '../typings/projectType';
import type { Env } from '../typings/Env';
import type { ConfigEntry, OverridableOption } from '../typings/configEntry/common';
import { isOverridableOption } from '../typings/configEntry/common';
import { isApplication, isChildApp, isModule, validate } from './validate';
import moduleVersion from '../utils/moduleVersion';
import { packageVersion } from '../utils/packageVersion';
import { showConfig } from './showConfig';
import type { Target } from '../typings/target';

// @TODO: maybe split settings depending on env?
export interface Settings<E extends Env> {
  env?: E;
  rootDir?: string;
  version?: string;
  buildType?: BuildType;
  debug?: boolean;
  trace?: boolean;
  sourceMap?: boolean;
  host?: string;
  port?: number;
  staticHost?: string;
  staticPort?: number;
  profile?: boolean;
  noServerRebuild?: boolean;
  noClientRebuild?: boolean;
  modern?: boolean;
  resolveSymlinks?: boolean;
  showConfig?: boolean;
  onlyBundles?: string[];
  disableProdOptimization?: boolean;
  fileCache?: boolean;
}

const getOption = <T>(optionName: string, cfgs: any[], dflt: T): T => {
  const getter = prop(optionName);

  for (let i = 0; i < cfgs.length; i++) {
    const value = getter(cfgs[i]);

    if (!isNil(value)) {
      return value;
    }
  }

  return dflt;
};

type OmitOverridable<T extends Record<string, any>> = {
  [key in keyof T]: T[key] extends OverridableOption<infer U>
    ? U
    : T[key] extends Record<string, any>
    ? OmitOverridable<T[key]>
    : T[key];
};

const omitEnvOptions = <T extends Record<string, any>>(
  env: Env,
  options: T
): OmitOverridable<T> => {
  return mapObj((value) => {
    if (isOverridableOption(value)) {
      return value[env];
    }

    if (isObject(value) && !isArray(value)) {
      return omitEnvOptions(env, value);
    }

    return value;
  }, options);
};

export type ConfigManager<
  C extends ConfigEntry = ConfigEntry,
  E extends Env = Env
> = OmitOverridable<C> &
  Required<Settings<E>> & {
    target: Target;
    buildPath: string;
    withSettings(settings: Settings<E>): ConfigManager<C, E>;
    dehydrate(): [C, Settings<E>];
  };

export const DEFAULT_PORT = 3000;
export const DEFAULT_STATIC_PORT = 4000;
export const DEFAULT_STATIC_MODULE_PORT = 4040;

export const createConfigManager = <C extends ConfigEntry = ConfigEntry, E extends Env = Env>(
  configEntry: C,
  settings: Settings<E>
): ConfigManager<C, E> => {
  const env: E = settings.env ?? ('development' as E);
  const normalizedConfigEntry = omitEnvOptions(env, configEntry);

  const { type } = configEntry;
  const rootDir = settings.rootDir ?? process.cwd();
  const debug = settings.debug ?? false;
  const modern = getOption('modern', [settings, configEntry], true);
  const buildType = settings.buildType ?? 'client';
  let target: Target = 'defaults';

  if (buildType === 'server') {
    target = 'node';
  } else if (modern) {
    target = 'modern';
  }

  const config: ConfigManager<C, E> = {
    ...normalizedConfigEntry,
    version:
      (type === 'module' ? moduleVersion(configEntry) : '') ||
      packageVersion(configEntry, env, rootDir) ||
      'unknown',
    trace: false,
    host: '0.0.0.0',
    staticHost: 'localhost',
    profile: false,
    noClientRebuild: false,
    noServerRebuild: false,
    resolveSymlinks: true,
    disableProdOptimization: false,
    onlyBundles: [],
    // according to measures fileCache in webpack doesn't affect
    // performance much so enable it by default as it always was before
    fileCache: true,
    showConfig: false,
    csr: false,
    ...settings,
    env,
    rootDir,
    buildType,
    debug,
    port: Number(settings.port ?? DEFAULT_PORT),
    staticPort: Number(
      settings.staticPort ?? (type === 'module' ? DEFAULT_STATIC_MODULE_PORT : DEFAULT_STATIC_PORT)
    ),
    modern,
    sourceMap:
      buildType === 'server' && debug
        ? true
        : getOption('sourceMap', [settings, normalizedConfigEntry], false),
    target,
    buildPath: '',
    withSettings(overrideSettings) {
      return createConfigManager(configEntry, {
        ...settings,
        ...overrideSettings,
      });
    },
    dehydrate() {
      return [
        configEntry,
        {
          ...settings,
          // drop options that couldn't be serialized
          stdout: undefined,
          stderr: undefined,
        },
      ];
    },
  };

  if (isApplication(config)) {
    config.buildPath = resolve(
      rootDir,
      buildType === 'server' ? config.output.server : config.output.client
    );
  } else if (isChildApp(config)) {
    config.buildPath = resolve(rootDir, ...config.output.split('/'));
  } else if (isModule(config)) {
    config.buildPath = resolve(rootDir, ...config.output.split('/'), config.name, config.version);
  }

  if (config.showConfig) {
    showConfig(config);
  }

  validate(config);

  return config;
};
