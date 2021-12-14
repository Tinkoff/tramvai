import type Config from 'webpack-chain';
import { container } from 'webpack';
import { getSharedModules } from '../child-app/moduleFederationShared';
import type { ModuleFederationPluginOptions } from '../types/webpack';
import type { ConfigManager } from '../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../typings/configEntry/application';

export const commonApplication = (configManager: ConfigManager<ApplicationConfigEntry>) => (
  config: Config
) => {
  config.plugin('module-federation').use(container.ModuleFederationPlugin, [
    {
      name: 'host',
      shared: getSharedModules(configManager),
    } as ModuleFederationPluginOptions,
  ]);
};
