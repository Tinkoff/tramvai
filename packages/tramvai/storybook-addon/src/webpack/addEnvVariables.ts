import webpack from 'webpack';
import type Config from 'webpack-chain';
import type { ConfigManager } from '@tramvai/cli';
import { configToEnv } from '@tramvai/cli';

export function addEnvVariables({
  webpackConfig,
  configManager,
}: {
  webpackConfig: Config;
  configManager: ConfigManager;
}) {
  const env = configManager.env === 'development' ? 'dev' : 'prod';

  webpackConfig.plugin('define').use(webpack.DefinePlugin, [
    {
      ...configManager.build.configurations.definePlugin[env],
      'process.env.NODE_ENV': JSON.stringify(configManager.env),
      'process.env.APP_ID': JSON.stringify(configManager.name),
      'process.env.BROWSER': true,
      'process.env.SERVER': false,
    },
  ]);

  configToEnv(configManager)(webpackConfig);
}
