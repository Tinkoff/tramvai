import type Config from 'webpack-chain';
import type { ConfigManager } from '../../config/configManager';

export type ConfigGenerator = (arg: {
  configManager: ConfigManager;
  showProgress?: boolean;
}) => Config;

export abstract class AnalyzePlugin {
  requireDeps?: string[];

  protected options?;

  protected abstract plugin;

  // eslint-disable-next-line sort-class-members/sort-class-members
  patchConfig = (config: Config): Config => {
    return this.patchConfigInternal(config);
  };

  // eslint-disable-next-line sort-class-members/sort-class-members
  afterBuild = (): Promise<any> => {
    return Promise.resolve();
  };

  protected patchConfigInternal(config: Config): Config {
    config.plugin('analyze').use(this.plugin, this.options);

    return config;
  }
}
