import type Config from 'webpack-chain';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { ignoreWarnings } from '../utils/warningsFilter';
import type { CliConfigEntry, ConfigManager } from '../../../api';
import { dedupe } from '../blocks/dedupe';

export default (configManager: ConfigManager<CliConfigEntry>) => (config: Config) => {
  config.plugin('case-sensitive-path').use(CaseSensitivePathsPlugin);

  config.stats({
    preset: 'errors-warnings',
    // отключает уведомление об успешной компиляции, его уже выводит webpackbar
    warningsCount: false,
  });

  config.set('ignoreWarnings', ignoreWarnings);

  config.set('infrastructureLogging', { level: 'warn' });

  config.output.pathinfo(false);

  config.module.set('unsafeCache', true);

  if (configManager.dedupe.enabledDev) {
    config.batch(dedupe(configManager));
  }

  return config;
};
