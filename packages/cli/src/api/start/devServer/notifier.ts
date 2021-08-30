import type webpack from 'webpack';
import WebpackBuildNotifierPlugin from 'webpack-build-notifier';
import type { ConfigManager } from '../../../config/configManager';
import type { ApplicationConfigEntry } from '../../../typings/configEntry/application';

const getStatsByType = (stats: webpack.MultiStats, type: string) => {
  return stats.stats.find((st) => {
    return st.compilation.compiler.name === type;
  });
};

export const notifier = (
  compiler: webpack.MultiCompiler,
  configManager: ConfigManager<ApplicationConfigEntry>
) => {
  const clientNotifier = new WebpackBuildNotifierPlugin({
    successSound: false,
    warningSound: false,
    ...configManager.serve?.notifications,
    ...configManager.serve?.notifications?.client,
  });
  const serverNotifier = new WebpackBuildNotifierPlugin({
    // отлкючаем нотификацию для одного из нотификатора, чтобы не дублировать
    suppressSuccess: 'always',
    successSound: false,
    warningSound: false,
    ...configManager.serve?.notifications,
    ...configManager.serve?.notifications?.server,
  });

  compiler.hooks.done.tap('webpack-build-notifier', (stats) => {
    const clientStats = getStatsByType(stats, 'client');
    const serverStats = getStatsByType(stats, 'server');

    clientStats && (clientNotifier as any).onCompilationDone(clientStats);
    serverStats && (serverNotifier as any).onCompilationDone(serverStats);
  });
};
