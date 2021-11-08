import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../typings/configEntry/application';

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
      'process.env.__TRAMVAI_EXPERIMENTAL_STATIC_PAGES_DIR': JSON.stringify(
        fileSystemPages.staticPagesDir
      ),
      'process.env.__TRAMVAI_EXPERIMENTAL_EXTERNAL_PAGES_DIR': JSON.stringify(
        fileSystemPages.externalPagesDir
      ),
    },
  ]);
};
