import propOr from '@tinkoff/utils/object/propOr';

import { resolve } from 'path';
import { node } from 'execa';
import waitOn from 'wait-on';
import type { Context } from '../../models/context';
import webpackBuild from '../../utils/webpackBuild';
import { webpackClientConfig } from '../../library/webpack/application/client/prod';
import { webpackServerConfig } from '../../library/webpack/application/server/prod';
import type { CommandResult } from '../../models/command';
import type { ApplicationConfigEntry } from '../../typings/configEntry/application';
import type { Params } from './command';
import { ConfigManager } from '../../config/configManager';
import { request } from './request';
import { generateStatic } from './generate';
import { toWebpackConfig } from '../../library/webpack/utils/toWebpackConfig';

export const staticApp = async (
  context: Context,
  configEntry: ApplicationConfigEntry,
  options: Params
): Promise<CommandResult> => {
  const clientConfigManager = new ConfigManager(configEntry, {
    env: 'production',
    ...options,
    buildType: 'client',
    modern: false,
  });
  const serverConfigManager = clientConfigManager.withSettings({ buildType: 'server' });

  await Promise.all([
    webpackBuild(
      clientConfigManager,
      toWebpackConfig(webpackClientConfig({ configManager: clientConfigManager })),
      context
    ),
    webpackBuild(
      serverConfigManager,
      toWebpackConfig(webpackServerConfig({ configManager: serverConfigManager })),
      context
    ),
  ]);

  const server = node(resolve(serverConfigManager.getBuildPath(), 'server.js'), {
    stdio: 'inherit',
  });

  const { name, host, port } = serverConfigManager;
  const bundleInfoPath = `http://${host}:${port}/${name}/papi/bundleInfo`;

  await Promise.race([
    server,
    waitOn({
      resources: [bundleInfoPath],
    }),
  ]);

  const paths = propOr('payload', [], await request({ url: bundleInfoPath }));

  await generateStatic(context, serverConfigManager, paths);

  server.kill();

  return {
    status: 'ok',
    message: 'application static generate success',
  };
};
