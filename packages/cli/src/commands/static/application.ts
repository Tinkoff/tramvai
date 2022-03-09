import propOr from '@tinkoff/utils/object/propOr';
import intersection from '@tinkoff/utils/array/intersection';

import path from 'path';
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
import { copyStatsJsonFileToServerDirectory } from '../../builder/webpack/utils/copyStatsJsonFile';
import { safeRequire } from '../../utils/safeRequire';
import { startStaticServer } from './staticServer';
import { startServer } from './server';

// eslint-disable-next-line max-statements
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

  if (options.buildType !== 'none') {
    // @TODO: перевести на builder
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
  } else {
    context.logger.event({
      type: 'debug',
      event: 'COMMAND:STATIC:BUILD',
      message: `message: build step skipped`,
    });
  }

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

  context.logger.event({
    type: 'debug',
    event: 'COMMAND:STATIC:SERVER_START',
    message: `message: start application server on http://${host}:${port}`,
  });

  const server = node(path.resolve(root, 'server.js'), [], {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...safeRequire(path.resolve(process.cwd(), 'env.development'), true),
      ...safeRequire(path.resolve(process.cwd(), 'env'), true),
      ...process.env,
      NODE_ENV: 'production',
      PORT: `${port}`,
      PORT_SERVER: `${port}`,
      ASSETS_PREFIX:
        process.env.ASSETS_PREFIX ??
        `http://${staticHost}:${staticPort}/${outputClient.replace(/\/$/, '')}/`,
    },
  });

  const bundleInfoPath = `http://localhost:${port}/${name}/papi/bundleInfo`;

  await Promise.race([
    server,
    waitOn({
      resources: [bundleInfoPath],
      delay: 1000,
      interval: 250,
      timeout: 10 * 60 * 1000,
    }),
  ]);

  context.logger.event({
    type: 'debug',
    event: 'COMMAND:STATIC:ROUTES_FETCH',
    message: `message: server started, fetch application routes`,
  });

  let paths = propOr('payload', [], await request({ url: bundleInfoPath }));

  if (options.onlyPages) {
    paths = intersection(paths, options.onlyPages);
  }

  context.logger.event({
    type: 'debug',
    event: 'COMMAND:STATIC:GENERATE',
    message: `message: routes fetched, generate pages`,
  });

  await generateStatic(context, serverConfigManager, paths);

  context.logger.event({
    type: 'debug',
    event: 'COMMAND:STATIC:CLOSE_SERVER',
    message: `message: pages generated, close application server`,
  });

  server.kill();

  context.logger.event({
    type: 'debug',
    event: 'COMMAND:STATIC:SERVER_CLOSED',
    message: `message: server closed successfully`,
  });

  if (options.serve) {
    await new Promise<void>((resolve) => {
      server.on('exit', () => resolve());
    });

    const staticServer = await startStaticServer(clientConfigManager);
    const htmlServer = await startServer(serverConfigManager);

    await new Promise<void>((resolve) => {
      htmlServer.on('exit', () => {
        staticServer.close(() => resolve());
      });
    });
  }

  return {
    status: 'ok',
    message: 'application static generate success',
  };
};
