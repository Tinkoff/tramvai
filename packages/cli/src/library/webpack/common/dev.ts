import type Config from 'webpack-chain';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { ignoreWarnings } from '../utils/warningsFilter';

export default () => (config: Config) => {
  config.plugin('case-sensitive-path').use(CaseSensitivePathsPlugin);

  config.stats('errors-warnings');

  config.set('ignoreWarnings', ignoreWarnings);

  config.set('infrastructureLogging', { level: 'warn' });

  config.output.pathinfo(false);

  config.module.set('unsafeCache', true);

  config.optimization.set('sideEffects', false);
  config.optimization.set('providedExports', false);

  return config;
};
