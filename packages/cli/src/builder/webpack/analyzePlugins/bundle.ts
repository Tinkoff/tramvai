import type ChainConfig from 'webpack-chain';
import { AnalyzePlugin } from '../types';

export class BundleAnalyzePlugin extends AnalyzePlugin {
  options = [
    {
      analyzerMode: 'server',
    },
  ];

  afterBuild = () => new Promise(() => null);

  get plugin() {
    // eslint-disable-next-line import/no-unresolved
    return require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  }

  patchConfigInternal(config: ChainConfig) {
    super.patchConfigInternal(config);

    if (config.output.get('libraryTarget') === 'lazy') {
      config.output.libraryTarget('commonjs');
    }

    return config;
  }

  // bundle analyzer поднимает dev server
}
