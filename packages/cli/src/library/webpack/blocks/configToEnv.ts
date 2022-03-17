import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../typings/configEntry/application';
import { shouldUseReactRoot } from '../../../utils/shouldUseReactRoot';

export const configToEnv = (configManager: ConfigManager<ApplicationConfigEntry>) => (
  config: Config
) => {
  const { fileSystemPages } = configManager.build.configurations.experiments;

  config.plugin('define').tap((args) => [
    {
      ...args[0],
      'process.env.__TRAMVAI_EXPERIMENTAL_ENABLE_FILE_SYSTEM_PAGES': JSON.stringify(
        fileSystemPages.enable
      ),
      'process.env.__TRAMVAI_EXPERIMENTAL_FILE_SYSTEM_ROUTES_DIR': JSON.stringify(
        fileSystemPages.routesDir
      ),
      'process.env.__TRAMVAI_EXPERIMENTAL_FILE_SYSTEM_PAGES_DIR': JSON.stringify(
        fileSystemPages.pagesDir
      ),
      'process.env.__TRAMVAI_CONCURRENT_FEATURES': JSON.stringify(
        shouldUseReactRoot(configManager)
      ),
    },
  ]);
};
