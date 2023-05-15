import type webpack from 'webpack';
import type { Compiler } from 'webpack';
import type { WebManifestOptions } from '../../../typings/pwa';

const pluginName = 'WebManifestPlugin';

export class WebManifestPlugin implements webpack.WebpackPluginInstance {
  constructor(private options: WebManifestOptions) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    const { webpack } = compiler;
    const { Compilation } = webpack;
    const { RawSource } = webpack.sources;
    const { dest, enabled, ...content } = this.options;

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        () => {
          const manifestFilename = dest;

          compilation.emitAsset(manifestFilename, new RawSource(JSON.stringify(content)));
        }
      );
    });
  }
}
