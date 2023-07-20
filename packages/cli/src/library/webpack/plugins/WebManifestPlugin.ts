import type webpack from 'webpack';
import type { Compiler } from 'webpack';
import type { PwaIconOptions, WebManifestOptions } from '../../../typings/pwa';

const pluginName = 'WebManifestPlugin';

export class WebManifestPlugin implements webpack.WebpackPluginInstance {
  constructor(
    private options: { manifest: WebManifestOptions; icon: PwaIconOptions; assetsPrefix: string }
  ) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    const { webpack } = compiler;
    const { Compilation } = webpack;
    const { RawSource } = webpack.sources;
    const {
      manifest: { dest, enabled, ...content },
      icon,
      assetsPrefix,
    } = this.options;

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        (compilationAssets) => {
          if (!content.icons && icon?.src) {
            const assets = Object.keys(compilationAssets);

            assets.forEach((asset) => {
              const assetInfo = compilation.assetsInfo.get(asset);
              // asset info `_pwaIconSize` added in PwaIconsPlugin
              const size = assetInfo._pwaIconSize;

              if (size) {
                if (!content.icons) {
                  content.icons = [];
                }

                content.icons.push({
                  src: `${assetsPrefix}${asset}`,
                  sizes: `${size}x${size}`,
                  type: 'image/png',
                });
              }
            });
          }

          const manifestFilename = dest.replace(/^\//, '');

          compilation.emitAsset(manifestFilename, new RawSource(JSON.stringify(content, null, 2)), {
            _webmanifestFilename: manifestFilename,
          });
        }
      );
    });
  }
}
