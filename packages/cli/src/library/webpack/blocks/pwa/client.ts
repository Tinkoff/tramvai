import path from 'path';
import type Config from 'webpack-chain';
import { InjectManifest } from 'workbox-webpack-plugin';
import type { ConfigManager } from '../../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../../typings/configEntry/application';
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

    // @todo check `@tramvai/module-progressive-web-app` is installed

    if (pwa.workbox?.enabled) {
      // @todo check `sw.ts` exists
      // @todo: static HTML caching ??? full offline mode for tramvai static ???
      const workboxOptions: InjectManifest['config'] = {
        swSrc: path.join(rootDir, root, pwa.sw?.src),
        swDest: path.join(rootDir, output.client, pwa.sw?.dest),
        exclude: [/hmr\.js$/, /\.map$/, /\.hot-update\./],
        // @todo maybe less for production?
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
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

      config.plugin('workbox').use(workboxPlugin);
    }

    if (pwa.webmanifest?.enabled) {
      const webmanifestPlugin = new WebManifestPlugin(pwa.webmanifest);

      config.plugin('webmanifest').use(webmanifestPlugin);
    }

    if (pwa.icon?.src) {
      const iconSrc = path.join(rootDir, root, pwa.icon.src);
      const pwaIconsPlugin = new PwaIconsPlugin({ ...pwa.icon, src: iconSrc });

      config.plugin('pwa-icons').use(pwaIconsPlugin);
    }
  };
