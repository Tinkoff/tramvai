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
import { copyStatsJsonFileToServerDirectory } from '../../api/build/utils/copyStatsJsonFile';
import { safeRequire } from '../../utils/safeRequire';

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

  await copyStatsJsonFileToServerDirectory(clientConfigManager);

  const {
    name,
    host,
    port,
    staticPort,
    staticHost,
    build: {
      options: { outputClient },
    },
  } = serverConfigManager;
  const root = serverConfigManager.getBuildPath();

  const server = node(resolve(root, 'server.js'), [], {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...safeRequire(resolve(process.cwd(), 'env.development'), true),
      ...safeRequire(resolve(process.cwd(), 'env'), true),
      ...process.env,
      NODE_ENV: 'production',
      PORT: `${port}`,
      PORT_SERVER: `${port}`,
      ASSETS_PREFIX:
        process.env.ASSETS_PREFIX ??
        `http://${staticHost}:${staticPort}/${outputClient.replace(/\/$/, '')}/`,
    },
  });

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
