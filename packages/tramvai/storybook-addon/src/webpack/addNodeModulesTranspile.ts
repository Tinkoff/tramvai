import type { Configuration } from 'webpack';
import { modernLibsFilter } from '@tinkoff/is-modern-lib';
import { babelConfigFactory } from '../babel/babelConfigFactory';

export function addNodeModulesTranspile({ baseConfig }: { baseConfig: Configuration }) {
  baseConfig.module.rules.push({
    test: /\.[cm]?js[x]?$/,
    include: modernLibsFilter,
    // already processed in storybook loaders
    exclude: /node_modules\/acorn-jsx/,
    loader: 'babel-loader',
    options: babelConfigFactory({ typescript: false }),
  });
}
