import path from 'path';
import type Config from 'webpack-chain';
import { InjectManifest } from 'workbox-webpack-plugin';
import fs from 'fs';
import type { ConfigManager } from '../../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../../typings/configEntry/application';
import { safeRequireResolve } from '../../../../utils/safeRequire';
import { PwaIconsPlugin } from '../../plugins/PwaIconsPlugin';
import { WebManifestPlugin } from '../../plugins/WebManifestPlugin';
import { pwaSharedBlock } from './shared';

export const pwaBlock =
  // eslint-disable-next-line max-statements
  (configManager: ConfigManager<ApplicationConfigEntry>) => (config: Config) => {
    const {
      experiments: { pwa },
      rootDir,
      root,
      output,
      env,
      modern,
      sourceMap,
      assetsPrefix,
    } = configManager;

    config.batch(pwaSharedBlock(configManager));

    if (
      !safeRequireResolve('@tramvai/module-progressive-web-app', true) &&
      (pwa.workbox?.enabled || pwa.webmanifest?.enabled)
    ) {
      throw Error('PWA functional requires @tramvai/module-progressive-web-app installed');
    }

    if (pwa.workbox?.enabled) {
      const swSrc = path.join(rootDir, root, pwa.sw?.src);
      const swDest = path.join(rootDir, output.client, pwa.sw?.dest);

      if (!fs.existsSync(swSrc)) {
        throw Error(
          `PWA workbox enabled but Service Worker source file not found by path ${swSrc}`
        );
      }

      // @todo: static HTML caching ??? full offline mode for tramvai static ???
      const workboxOptions: InjectManifest['config'] = {
        swSrc,
        swDest,
        exclude: [/hmr\.js$/, /\.map$/, /\.hot-update\./],
        maximumFileSizeToCacheInBytes: env === 'production' ? 5 * 1024 * 1024 : 10 * 1024 * 1024,
        chunks: pwa.workbox.chunks,
        excludeChunks: pwa.workbox.excludeChunks,
        additionalManifestEntries: [
          // @todo CSR fallback or all static pages?
          // do not forget about revision and possible conflict with modifyURLPrefix
        ],
        manifestTransforms: [
          (manifest, compilation: any) => {
            return {
              // we need to have a relative webmanifest url for precaching
              manifest: manifest.map((asset) => {
                const assetName = asset.url.replace(assetsPrefix, '');
                // in development build `publicPath` is localhost, in production is empty string
                const publicPath = compilation.outputOptions?.publicPath || assetsPrefix;
                const assetInfo = compilation.assetsInfo.get(asset.url.replace(publicPath, ''));

                if (assetInfo?._webmanifestFilename) {
                  return {
                    ...asset,
                    url: `${pwa.sw.scope}${assetName}`,
                  };
                }
                return asset;
              }),
            };
          },
        ],
      };

      if (pwa.workbox.include) {
        workboxOptions.include = pwa.workbox.include.map((expr) => new RegExp(expr));
      }
      if (pwa.workbox.exclude) {
        workboxOptions.exclude = [
          ...workboxOptions.exclude,
          ...pwa.workbox.exclude.map((expr) => new RegExp(expr)),
        ];
      }
      if (pwa.workbox.additionalManifestEntries) {
        workboxOptions.additionalManifestEntries = [
          ...workboxOptions.additionalManifestEntries,
          ...pwa.workbox.additionalManifestEntries,
        ];
      }

      if (env === 'production') {
        workboxOptions.dontCacheBustURLsMatching = /\/\w+?\.[\w\d]+?\.(js|css|gif|png|jpe?g|svg)$/;

        workboxOptions.modifyURLPrefix = {
          '': assetsPrefix,
        };
      }

      if (modern) {
        workboxOptions.swDest = workboxOptions.swDest.replace(/\.js$/, '.modern.js');
      }

      // @todo: break hmr on client when sw.ts is changed - infinity loop !!!

      const workboxPlugin = new InjectManifest(workboxOptions);

      // https://github.com/GoogleChrome/workbox/issues/1790#issuecomment-1241356293
      if (env === 'development') {
        Object.defineProperty(workboxPlugin, 'alreadyCalled', {
          get() {
            return false;
          },
          set() {},
        });
      }

      // Fix `ERROR in Invalid URL` problem
      // https://github.com/webpack/webpack/issues/9570#issuecomment-520713006
      if (sourceMap) {
        config.output.set('devtoolNamespace', 'tramvai');
      }

      config.plugin('define').tap((args) => [
        {
          ...args[0],
          'process.env.ASSETS_PREFIX': JSON.stringify(assetsPrefix),
        },
      ]);

      config.plugin('workbox').use(workboxPlugin);
    }

    if (pwa.webmanifest?.enabled) {
      const webmanifestPlugin = new WebManifestPlugin({
        manifest: pwa.webmanifest,
        icon: pwa.icon,
        assetsPrefix,
      });

      config.plugin('webmanifest').use(webmanifestPlugin);
    }

    if (pwa.icon?.src) {
      const iconSrc = path.join(rootDir, root, pwa.icon.src);
      const pwaIconsPlugin = new PwaIconsPlugin({
        ...pwa.icon,
        src: iconSrc,
        mode: configManager.env,
      });

      config.plugin('pwa-icons').use(pwaIconsPlugin);
    }
  };
