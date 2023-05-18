import path from 'path';
import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../../typings/configEntry/application';

export const pwaSharedBlock =
  (configManager: ConfigManager<ApplicationConfigEntry>) => (config: Config) => {
    const {
      experiments: { pwa },
      rootDir,
      root,
      modern,
    } = configManager;

    config.plugin('define').tap((args) => [
      {
        ...args[0],
        'process.env.TRAMVAI_PWA_WORKBOX_ENABLED': JSON.stringify(pwa.workbox?.enabled),
        // @todo duplicated logic with path.join
        'process.env.TRAMVAI_PWA_SW_SRC': JSON.stringify(path.join(rootDir, root, pwa.sw?.src)),
        'process.env.TRAMVAI_PWA_SW_DEST': JSON.stringify(pwa.sw?.dest),
        'process.env.TRAMVAI_PWA_SW_SCOPE': JSON.stringify(pwa.sw?.scope),
        'process.env.TRAMVAI_PWA_MANIFEST_ENABLED': JSON.stringify(pwa.webmanifest?.enabled),
        'process.env.TRAMVAI_PWA_MANIFEST_DEST': JSON.stringify(pwa.webmanifest?.dest),
        // allows to detect that sw.modern.js is exists or not
        'process.env.TRAMVAI_MODERN_BUILD': JSON.stringify(modern),
      },
    ]);
  };
