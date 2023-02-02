import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../config/configManager';
import { isApplication } from '../../../config/validate';
import type { ConfigEntry } from '../../../typings/configEntry/common';
import { shouldUseReactRoot } from '../../../utils/shouldUseReactRoot';

export const configToEnv = (configManager: ConfigManager<ConfigEntry>) => (config: Config) => {
  const { fileSystemPages } = isApplication(configManager)
    ? configManager
    : { fileSystemPages: { enabled: false, routesDir: false, pagesDir: false } };

  config.plugin('define').tap((args) => [
    {
      ...args[0],
      'process.env.__TRAMVAI_EXPERIMENTAL_ENABLE_FILE_SYSTEM_PAGES': JSON.stringify(
        fileSystemPages.enabled
      ),
      'process.env.__TRAMVAI_EXPERIMENTAL_FILE_SYSTEM_ROUTES_DIR': JSON.stringify(
        fileSystemPages.routesDir
      ),
      'process.env.__TRAMVAI_EXPERIMENTAL_FILE_SYSTEM_PAGES_DIR': JSON.stringify(
        fileSystemPages.pagesDir
      ),
      'process.env.__TRAMVAI_CONCURRENT_FEATURES': JSON.stringify(shouldUseReactRoot()),
      'process.env.__TRAMVAI_FORCE_CLIENT_SIDE_RENDERING': JSON.stringify(configManager.csr),
    },
  ]);
};
