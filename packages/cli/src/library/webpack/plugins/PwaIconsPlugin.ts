import type webpack from 'webpack';
import type { Compiler } from 'webpack';
import type Sharp from 'sharp';
import type { PwaIconOptions } from '../../../typings/pwa';

const pluginName = 'PwaIconsPlugin';

export class PwaIconsPlugin implements webpack.WebpackPluginInstance {
  private hash: string;

  constructor(private options: PwaIconOptions) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    const { webpack } = compiler;
    const { Compilation } = webpack;
    const { RawSource } = webpack.sources;
    const { src, dest, sizes } = this.options;

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      // watch icon source file
      if (!compilation.fileDependencies.has(src)) {
        compilation.fileDependencies.add(src);
      }

      compilation.hooks.processAssets.tapPromise(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        async () => {
          try {
            const sharp: typeof Sharp = require('sharp');
            // check icon source file updates
            const nextHash = await new Promise<string>((resolve) => {
              compilation.fileSystemInfo.getFileHash(src, (_, hash) => {
                resolve(hash);
              });
            });

            if (!this.hash) {
              this.hash = nextHash;
            } else if (this.hash === nextHash) {
              // skip if icon source file not changed
              return;
            }

            // @todo persistent cache between builds !!!
            const promises = sizes.map((size) => {
              return sharp(src)
                .resize({ width: size, height: size })
                .png({
                  quality: 95,
                  compressionLevel: 8,
                  adaptiveFiltering: true,
                  progressive: true,
                  force: true,
                })
                .toBuffer()
                .then((content) => ({
                  filename: `${dest}/${size}x${size}.png`,
                  content,
                }));
            });

            const results = await Promise.all(promises);

            results.forEach(({ filename, content }) => {
              const source = new RawSource(content);
              const asset = compilation.getAsset(filename);

              if (asset) {
                compilation.updateAsset(filename, source);
              } else {
                compilation.emitAsset(filename, source);
              }
            });
          } catch (e) {
            // @todo: throw error?
            console.error('PWA icons processing error:', e);
          }
        }
      );
    });
  }
}
