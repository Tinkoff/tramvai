import { dirname } from 'path';
import type Config from 'webpack-chain';
import { IgnorePlugin } from 'webpack';

interface Options {
  entry: string;
  onlyBundles?: string[];
}

export const commonApplicationDev = ({ entry, onlyBundles }: Options) => (config: Config) => {
  if (onlyBundles) {
    config.plugin('only-bundles').use(IgnorePlugin, [
      {
        resourceRegExp: new RegExp(`bundles/(?!${onlyBundles.join('|')})`),
        contextRegExp: new RegExp(`${dirname(entry)}$`),
      },
    ]);
  }
};
