import type webpack from 'webpack';
import type { Compiler } from 'webpack';

const PLUGIN_NAME = 'ModuleFederationIgnoreEntires';

export interface ModuleFederationIgnoreEntriesOptions {
  entries: string[];
}

/**
 * Temporary fix of usage ModuleFederation with multiple entries
 * [open discussion](https://github.com/webpack/webpack/discussions/14985) how to do it properly
 */
export class ModuleFederationIgnoreEntries implements webpack.WebpackPluginInstance {
  protected entries: Set<string>;

  constructor(options: ModuleFederationIgnoreEntriesOptions) {
    this.entries = new Set(options.entries);
  }

  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.beforeChunks.tap(PLUGIN_NAME, () => {
        const { includeDependencies } = compilation.globalEntry;

        for (const [entryName, entry] of compilation.entries) {
          if (!this.entries.has(entryName)) {
            // includeDependencies are set by ModuleFederationPlugin and consist of shared modules
            // as it is added to globalEntry it will be copied to every entry chunk
            // move these modules from global entry to every entry that should have containers runtime
            entry.includeDependencies.push(...includeDependencies);
          }
        }

        // eslint-disable-next-line no-param-reassign
        compilation.globalEntry.includeDependencies = [];
      });

      // through that hook ModuleFederationPlugin adds some runtime code for the containers
      // intercept this call to prevent this function from execution for the entries that
      // should not have containers runtime
      compilation.hooks.additionalTreeRuntimeRequirements.intercept({
        register: (tap) => {
          if (tap.name === 'ConsumeSharedPlugin') {
            const originalFn = tap.fn;
            // eslint-disable-next-line no-param-reassign
            tap.fn = (chunk, ...args) => {
              if (!this.entries.has(chunk.name)) {
                originalFn(chunk, ...args);
              }
            };
          }

          return tap;
        },
      });
    });
  }
}
