import type webpack from 'webpack';
import type { Compiler, NormalModule } from 'webpack';
import { sync as resolve } from 'resolve';
import type packageJson from 'package-json';
import chalk from 'chalk';
// eslint-disable-next-line no-restricted-imports
import { parseRange } from 'webpack/lib/util/semver';
import { isDependantLib, isUnifiedVersion } from '../../../utils/tramvaiVersions';

const PLUGIN_NAME = 'ModuleFederationValidateDuplicates';

type SemverRange = [number, number, number, number];

interface SharedModuleOptions {
  shareKey: string;
  requiredVersion?: SemverRange;
  importResolved: string;
  singleton?: boolean;
}

interface SharedModule extends NormalModule {
  options?: SharedModuleOptions;
}

const resolvePackageVersion = (name: string, basedir: string) => {
  try {
    const packageJsonPath = resolve(`${name}/package.json`, {
      basedir,
    });
    const packageJson: packageJson.FullMetadataOptions = require(packageJsonPath);

    return packageJson.version;
  } catch (error: any) {
    console.warn(`ModuleFederation: could not infer version for package "${name}"`);
  }
};

export interface ModuleFederationFixRangeOptions {
  flexibleTramvaiVersions: boolean;
}

export class ModuleFederationFixRange implements webpack.WebpackPluginInstance {
  private flexibleTramvaiVersions: boolean;
  // { name: { importResolved: { number }} }
  private sharedModules: Map<string, Map<string, Set<number>>> = new Map();

  constructor({ flexibleTramvaiVersions }: ModuleFederationFixRangeOptions) {
    this.flexibleTramvaiVersions = flexibleTramvaiVersions ?? false;
  }

  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (_, { normalModuleFactory }) => {
      normalModuleFactory.hooks.factorize.intercept({
        register: (tap) => {
          if (tap.name === 'ConsumeSharedPlugin') {
            const originalFn = tap.fn;
            // eslint-disable-next-line no-param-reassign
            tap.fn = async (...args) => {
              const module: SharedModule | undefined = await originalFn(...args);

              if (module?.options) {
                this.fixVersionRange(module);
              }

              return module;
            };
          }

          return tap;
        },
      });
    });

    compiler.hooks.done.tap(PLUGIN_NAME, () => {
      const duplicates: Array<{ name: string; paths: string[] }> = [];
      const criticalDuplicates: Array<{ name: string; path: string }> = [];

      for (const [name, shared] of this.sharedModules) {
        if (shared.size > 1) {
          duplicates.push({
            name,
            paths: [...shared.keys()],
          });
        }

        for (const [path, versions] of shared) {
          if (versions.size > 1) {
            criticalDuplicates.push({ name, path });
          }
        }
      }

      // reset sharedModules info after compilation has ended
      this.sharedModules = new Map();

      if (duplicates.length) {
        console.warn(`⚠️  ModuleFederation: Found duplicates for next shared modules:
${duplicates
  .map(({ name, paths }) => {
    return `\t${chalk.yellowBright(name)}: ${paths.join(', ')}`;
  })
  .join('\n')}
        `);
      }

      if (criticalDuplicates.length) {
        console.error(
          `❗ ModuleFederation: Found duplicates for shared modules with different major versions that are resolved to the same path:
${criticalDuplicates
  .map(({ name, path }) => {
    return `\t${chalk.red(name)}: ${path}`;
  })
  .join('\n')}`
        );

        // @todo Not ending build, just freezing it. Also is not obvious what to do
        // throw new Error(
        //   'ModuleFederation: Different major versions have resolved to the same path for shared modules, please review errors above'
        // );
      }
    });
  }

  fixVersionRange(module: SharedModule) {
    const {
      options,
      options: { shareKey: name, singleton, importResolved },
      context,
    } = module;
    let { requiredVersion } = options;

    // ignore singletons as the actual version won't change anything
    // and usually it is just a react and co libraries
    if (!requiredVersion && context && !singleton) {
      const version = resolvePackageVersion(name, context);
      if (version) {
        requiredVersion = parseRange(version);
      }
    }

    if (!requiredVersion) {
      return;
    }

    if (requiredVersion && this.flexibleTramvaiVersions) {
      const isTramvai = isUnifiedVersion(name) || isDependantLib(name);

      if (isTramvai && requiredVersion[0] > 2) {
        // 1 is used for `^` range modifier
        // see https://github.com/webpack/webpack/blob/56363993156e06a1230c9759eba277a22e6b6604/lib/util/semver.js#LL235C20-L235C20
        requiredVersion[0] = 1;
      }
    }

    // change version in webpack module
    options.requiredVersion = requiredVersion;

    let shared = this.sharedModules.get(name);

    if (!shared) {
      shared = new Map();
      this.sharedModules.set(name, shared);
    }

    let versions = shared.get(importResolved);

    if (!versions) {
      versions = new Set();
      shared.set(importResolved, versions);
    }

    // save major version of the semver array
    versions.add(requiredVersion[1]);
  }
}
