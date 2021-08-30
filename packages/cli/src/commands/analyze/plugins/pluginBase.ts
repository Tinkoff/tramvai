import type ChainConfig from 'webpack-chain';

export abstract class AnalyzePlugin {
  requireDeps?: string[];

  protected options?;

  protected abstract plugin;

  // eslint-disable-next-line sort-class-members/sort-class-members
  patchConfig = (config: ChainConfig): ChainConfig => {
    return this.patchConfigInternal(config);
  };

  // eslint-disable-next-line sort-class-members/sort-class-members
  afterBuild = (): PromiseLike<any> => {
    return Promise.resolve();
  };

  protected patchConfigInternal(config: ChainConfig): ChainConfig {
    config.plugin('analyze').use(this.plugin, this.options);

    return config;
  }
}
