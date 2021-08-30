import mapObj from '@tinkoff/utils/object/map';
import type webpack from 'webpack';
import type Config from 'webpack-chain';

export const toWebpackConfig = (config: Config): webpack.Configuration => {
  const cfg = config.toConfig();

  return {
    ...cfg,
    entry: mapObj((entry) => {
      if (entry.length === 1) {
        return entry[0];
      }

      return entry;
    }, cfg.entry as any),
  };
};
