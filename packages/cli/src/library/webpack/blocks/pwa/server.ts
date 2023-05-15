import type Config from 'webpack-chain';
import type { ConfigManager } from '../../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../../typings/configEntry/application';
import { pwaSharedBlock } from './shared';

export const pwaBlock =
  (configManager: ConfigManager<ApplicationConfigEntry>) => (config: Config) => {
    config.batch(pwaSharedBlock(configManager));
  };
