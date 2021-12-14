import chalk from 'chalk';
import type ChainConfig from 'webpack-chain';
import type { Context } from '../../models/context';
import type { CommandResult } from '../../models/command';
import type { Params } from './command';
import { WhyBundledAnalyzePlugin } from './plugins/whyBundled';
import { BundleAnalyzePlugin } from './plugins/bundle';
import type { AnalyzePlugin } from './plugins/pluginBase';
import webpackBuild from '../../utils/webpackBuild';
import { webpackClientConfig as applicationClientConfig } from '../../library/webpack/application/client/prod';
import { webpackClientConfig as moduleClientConfig } from '../../library/webpack/module/client/prod';
import { webpackClientConfig as childAppClientConfig } from '../../library/webpack/child-app/client/prod';
import type { ProjectType } from '../../typings/projectType';
import { ConfigManager } from '../../config/configManager';
import { npmRequireList } from '../../utils/npmRequire';
import { StatoscopeAnalyzePlugin } from './plugins/statoscope';
import { toWebpackConfig } from '../../library/webpack/utils/toWebpackConfig';

interface Type<T> extends Function {
  new (...args: any[]): T;
}

const pluginMap: Record<Params['plugin'], Type<AnalyzePlugin>> = {
  bundle: BundleAnalyzePlugin,
  whybundled: WhyBundledAnalyzePlugin,
  statoscope: StatoscopeAnalyzePlugin,
};

function getClientConfig(configManager: ConfigManager) {
  const clientTypeMap: Record<ProjectType, ({ configManager: ConfigManager }) => ChainConfig> = {
    application: applicationClientConfig,
    module: moduleClientConfig,
    'child-app': childAppClientConfig,
    package: null,
  };
  const getConfig = clientTypeMap[configManager.type];

  return getConfig({ configManager });
}

export default async function analyze(
  context: Context,
  { plugin = 'bundle', target, showConfig }: Params
): Promise<CommandResult> {
  const PluginClass = pluginMap[plugin];
  if (!PluginClass) {
    return Promise.reject(new Error('set correct plugin option'));
  }
  const { patchConfig, afterBuild, requireDeps } = new PluginClass();

  if (requireDeps) {
    await npmRequireList({
      cliRootDir: context.cliRootDir,
      packageManager: context.cliPackageManager,
      dependencies: requireDeps,
      description: 'Install dependencies for the analyze command',
    });
  }

  const configEntry = context.config.getProject(target);
  const configManager = new ConfigManager(configEntry, {
    env: 'production',
    showConfig,
  });
  const webpackConfig = getClientConfig(configManager);

  const patchedConfig = toWebpackConfig(patchConfig(webpackConfig));

  console.log(chalk.green('Starting build with analyze tool'));
  return webpackBuild(configManager, patchedConfig, context)
    .then(afterBuild)
    .then(() => ({
      status: 'ok',
      message: 'application build success',
    }));
}
