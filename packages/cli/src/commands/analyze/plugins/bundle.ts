import { AnalyzePlugin } from './pluginBase';

export class BundleAnalyzePlugin extends AnalyzePlugin {
  afterBuild = () => new Promise(() => null);

  get plugin() {
    // eslint-disable-next-line import/no-unresolved
    return require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  }

  // bundle analyzer поднимает dev server
}
