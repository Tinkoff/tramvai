import type webpack from 'webpack';
import type { Compiler, NormalModule } from 'webpack';
import { WebpackError } from 'webpack';
// eslint-disable-next-line no-restricted-imports
import { parseRange, satisfy } from 'webpack/lib/util/semver';
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

export interface ModuleFederationFixRangeOptions {
  flexibleTramvaiVersions: boolean;
}

export class ModuleFederationFixRange implements webpack.WebpackPluginInstance {
  private flexibleTramvaiVersions: boolean;
  // { name: { importResolved: { number }} }
  private sharedModules: Map<string, Map<string, Set<SharedModule>>> = new Map();

  constructor({ flexibleTramvaiVersions }: ModuleFederationFixRangeOptions) {
    this.flexibleTramvaiVersions = flexibleTramvaiVersions ?? false;
  }

  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
      normalModuleFactory.hooks.factorize.intercept({
        register: (tap) => {
          if (tap.name === 'ConsumeSharedPlugin') {
            const originalFn = tap.fn;
            // eslint-disable-next-line no-param-reassign
            tap.fn = async (...args) => {
              const module: SharedModule | undefined = await originalFn(...args);

              if (module?.options) {
                const { shareKey: name, importResolved } = module.options;

                let shared = this.sharedModules.get(name);

                if (!shared) {
                  shared = new Map();
                  this.sharedModules.set(name, shared);
                }

                let modules = shared.get(importResolved);

                if (!modules) {
                  modules = new Set();
                  shared.set(importResolved, modules);
                }

                // save major version of the semver array
                modules.add(module);
              }

              return module;
            };
          }

          return tap;
        },
      });

      // eslint-disable-next-line max-statements
      compilation.hooks.optimizeDependencies.tap(PLUGIN_NAME, () => {
        for (const [name, sharedModulesByName] of this.sharedModules.entries()) {
          const hasDuplicates = sharedModulesByName.size > 1;

          for (const [importResolved, sharedModulesByPath] of sharedModulesByName.entries()) {
            if (hasDuplicates) {
              const error = new WebpackError(
                `This file is a duplicate for a module "${name}" that resolved to different path`
              );
              error.file = importResolved;
              compilation.warnings.push(error);
            }

            let validModule: SharedModule;
            let validVersion: string;
            const invalidModules = new Set<SharedModule>();

            for (const sharedModule of sharedModulesByPath) {
              const connections = compilation.moduleGraph.getOutgoingConnections(sharedModule);

              for (const { module } of connections) {
                const resolvedVersion = module.resourceResolveData?.descriptionFileData?.version;
                this.fixVersionRange(sharedModule, resolvedVersion);

                const requiredVersion = sharedModule?.options?.requiredVersion;

                if (requiredVersion && resolvedVersion) {
                  if (satisfy(requiredVersion, resolvedVersion)) {
                    validModule = sharedModule;
                    validVersion = resolvedVersion;
                  } else {
                    invalidModules.add(sharedModule);
                  }
                }
                // there should by only one outgoing module for ConsumeSharedModule
                break;
              }
            }

            if (invalidModules.size > 0 && validModule) {
              for (const sharedModule of invalidModules) {
                const error = new WebpackError(
                  `Shared module has been actually resolved to ${validVersion} instead of the expected`
                );
                error.module = sharedModule;
                compilation.warnings.push(error);

                // replace invalid module with valid version (invalid anyway are resolved to wrong version)
                // to prevent any issues with shared dependencies
                compilation.moduleGraph.moveModuleConnections(
                  sharedModule,
                  validModule,
                  (connection) => {
                    // ignore any outgoing connections as we want to ignore that module entirely and all its dependencies
                    return connection.originModule !== sharedModule;
                  }
                );
              }
            }
          }
        }

        // reset sharedModules info after validation
        this.sharedModules = new Map();
      });
    });
  }

  fixVersionRange(sharedModule: SharedModule, resolvedVersion?: string) {
    const {
      options,
      options: { shareKey: name, singleton },
      context,
    } = sharedModule;
    let { requiredVersion } = options;

    // if version was not resolved automatically then get the version
    // from actual module
    // ignore singletons as the actual version won't change anything
    // and usually it is just a react and co libraries
    if (!requiredVersion && context && !singleton) {
      if (resolvedVersion) {
        requiredVersion = parseRange(resolvedVersion);
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
  }
}
