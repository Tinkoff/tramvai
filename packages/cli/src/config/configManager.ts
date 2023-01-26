import isNil from '@tinkoff/utils/is/nil';
import prop from '@tinkoff/utils/object/prop';
import { resolve } from 'path';
import type { ProjectType, BuildType } from '../typings/projectType';
import type { Env } from '../typings/Env';
import type { ConfigEntry } from '../typings/configEntry/common';
import { validate } from './validate';
import moduleVersion from '../utils/moduleVersion';
import { packageVersion } from '../utils/packageVersion';
import type { DeduplicateStrategy } from '../library/webpack/plugins/DedupePlugin';
import { showConfig } from './showConfig';
import type { Target } from '../typings/target';

export interface Settings<E extends Env> {
  env?: E;
  rootDir?: string;
  version?: string;
  buildType?: BuildType;
  debug?: boolean;
  trace?: boolean;
  removeTypeofWindow?: boolean;
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
  // force client-side rendering mode
  csr?: boolean;
}

const getOption = <T>(optionName: string, cfgs: any[], dflt?: T): T => {
  const getter = prop(optionName);

  for (let i = 0; i < cfgs.length; i++) {
    const value = getter(cfgs[i]);

    if (!isNil(value)) {
      return value;
    }
  }

  return dflt;
};

export class ConfigManager<T extends ConfigEntry = ConfigEntry, E extends Env = any>
  implements Required<Settings<E>>
{
  private configEntry: T;

  public name: string;

  public type: ProjectType;

  public root: string;

  public build: T['commands']['build'];

  public serve: T['commands']['serve'];

  private settings: Settings<E>;

  public version: string;

  public env: E;

  public buildType: BuildType;

  public rootDir: string;

  public debug: boolean;

  public trace: boolean;

  public sourceMap: boolean;

  public host: string;

  public port: number;

  public staticHost: string;

  public staticPort: number;

  public profile: boolean;

  public noServerRebuild: boolean;

  public noClientRebuild: boolean;

  public modern: boolean;

  public dedupe: DeduplicateStrategy | false;

  public dedupeIgnore?: RegExp[];

  public removeTypeofWindow: boolean;

  public resolveSymlinks: boolean;

  public hotRefresh: boolean;

  public disableProdOptimization: boolean;

  public target: Target;

  public fileCache: boolean;

  public experiments: T['commands'][E extends 'development'
    ? 'serve'
    : 'build']['configurations']['experiments'];

  public showConfig: boolean;

  public csr: boolean;

  // eslint-disable-next-line complexity,max-statements
  constructor(configEntry: T, settings: Settings<E>) {
    this.configEntry = configEntry;
    this.name = configEntry.name;
    this.type = configEntry.type;
    this.root = configEntry.root;
    this.build = configEntry.commands.build || {};
    this.serve = configEntry.commands.serve || {};

    this.settings = settings;
    this.env = settings.env || ('development' as E);
    this.rootDir = settings.rootDir || process.cwd();
    this.version =
      settings.version ||
      (this.type === 'module' ? moduleVersion(configEntry) : '') ||
      (this.type === 'child-app' ? packageVersion(configEntry, this.env, this.rootDir) : '');
    this.buildType = settings.buildType || 'client';
    this.debug = settings.debug || false;
    this.trace = settings.trace || false;
    this.sourceMap =
      this.buildType === 'server' && this.debug
        ? true
        : getOption(
            'sourceMap',
            [
              settings,
              this.env === 'development' ? this.serve.configurations : this.build.configurations,
            ],
            false
          );
    this.host = settings.host || '0.0.0.0';
    this.port = Number(settings.port ?? 3000);
    this.staticHost = settings.staticHost || 'localhost';
    this.staticPort = Number(settings.staticPort ?? (this.type === 'module' ? 4040 : 4000));
    this.profile = settings.profile || false;
    this.noServerRebuild = settings.noServerRebuild || false;
    this.noClientRebuild = settings.noClientRebuild || false;
    this.modern = getOption(
      'modern',
      [
        settings,
        this.env === 'development' ? this.serve.configurations : this.build.configurations,
      ],
      true
    );
    this.dedupe = this.build.configurations?.dedupe;
    this.dedupeIgnore = this.build.configurations?.dedupeIgnore?.map(
      (ignore) => new RegExp(`^${ignore}`)
    );
    this.removeTypeofWindow = this.build.configurations?.removeTypeofWindow;
    this.resolveSymlinks = settings.resolveSymlinks ?? true;
    this.hotRefresh = this.env === 'development' && this.serve.configurations?.hotRefresh;
    this.disableProdOptimization = settings.disableProdOptimization ?? false;
    this.onlyBundles = settings.onlyBundles;
    this.target = this.resolveTarget();
    // according to measures fileCache in webpack doesn't affect
    // performance much so enable it by default as it always was before
    this.fileCache = settings.fileCache ?? true;
    this.experiments =
      (this.env === 'development'
        ? this.serve.configurations?.experiments
        : this.build.configurations?.experiments) ?? {};
    this.showConfig = settings.showConfig ?? false;
    this.csr = settings.csr ?? false;

    if (this.showConfig) {
      showConfig(this);
    }

    validate(this);
  }

  public onlyBundles: string[];

  getBuildPath() {
    switch (this.type) {
      case 'application':
        return resolve(
          this.rootDir,
          this.buildType === 'server'
            ? this.build.options.outputServer
            : this.build.options.outputClient
        );
      case 'module':
        return resolve(
          this.rootDir,
          ...this.build.options.output.split('/'),
          this.name,
          this.version
        );
      case 'child-app':
        return resolve(this.rootDir, ...this.build.options.output.split('/'));
    }

    throw new Error('projectType not supported');
  }

  withSettings(settings: Settings<E>) {
    return new ConfigManager(this.configEntry, {
      ...this.settings,
      ...settings,
    });
  }

  dehydrate() {
    return {
      configEntry: this.configEntry,
      settings: {
        ...this.settings,
        rootDir: this.rootDir,
        // drop options that couldn't be serialized
        stdout: undefined,
        stderr: undefined,
      },
    };
  }

  static rehydrate(state: ReturnType<ConfigManager['dehydrate']>) {
    return new ConfigManager(state.configEntry, state.settings);
  }

  private resolveTarget(): Target {
    if (this.buildType === 'server') {
      return 'node';
    }

    if (this.modern) {
      return 'modern';
    }

    return 'defaults';
  }
}
