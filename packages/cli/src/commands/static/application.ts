import intersection from '@tinkoff/utils/array/intersection';

import path from 'path';
import { node } from 'execa';
import waitOn from 'wait-on';
import envCi from 'env-ci';
import type { Context } from '../../models/context';
import type { CommandResult } from '../../models/command';
import type { ApplicationConfigEntry } from '../../typings/configEntry/application';
import type { Params } from './command';
import { createConfigManager } from '../../config/configManager';
import { generateStatic } from './generate';
import { copyStatsJsonFileToServerDirectory } from '../../builder/webpack/utils/copyStatsJsonFile';
import { safeRequire } from '../../utils/safeRequire';
import { app } from '../index';
import { startStaticServer } from './staticServer';
import { startServer } from './server';
import { handleServerOutput } from './utils/handle-server-output';
import { appBundleInfo } from '../../utils/dev-app/request';

// eslint-disable-next-line max-statements
export const staticApp = async (
  context: Context,
  configEntry: ApplicationConfigEntry,
  options: Params
): Promise<CommandResult> => {
  const clientConfigManager = createConfigManager(configEntry, {
    env: 'production',
    ...options,
    buildType: 'client',
    modern: false,
  });
  const serverConfigManager = clientConfigManager.withSettings({ buildType: 'server' });

  if (options.buildType !== 'none') {
    context.logger.event({
      type: 'debug',
      event: 'COMMAND:STATIC:BUILD',
      message: `message: build step was started`,
    });

    await app.run('build', options);

    await copyStatsJsonFileToServerDirectory(clientConfigManager);
  } else {
    context.logger.event({
      type: 'debug',
      event: 'COMMAND:STATIC:BUILD',
      message: `message: build step was skipped`,
    });
  }

  const { name, host, port, staticPort, staticHost, output } = serverConfigManager;
  const root = serverConfigManager.buildPath;
  const assetsPrefix = process.env.ASSETS_PREFIX;

  if (!assetsPrefix) {
    context.logger.event({
      type: 'warning',
      event: 'COMMAND:STATIC:BUILD',
      message:
        'message: ASSETS_PREFIX variable is not defined. It will cause ' +
        'of incorrect urls for static assets in your files. Also, some features, ' +
        'like a resources inlining will not work.',
    });
  }

  context.logger.event({
    type: 'debug',
    event: 'COMMAND:STATIC:SERVER_START',
    message: `message: start application server on http://${host}:${port}`,
  });

  const staticServer = await startStaticServer(clientConfigManager);
  const staticAssetsPrefix = serverConfigManager.assetsPrefix;

  const server = node(path.resolve(root, 'server.js'), [], {
    cwd: root,
    env: {
      ...(process.env.DANGEROUS_UNSAFE_ENV_FILES === 'true' || !envCi().isCi
        ? {
            ...safeRequire(path.resolve(process.cwd(), 'env.development'), true),
            ...safeRequire(path.resolve(process.cwd(), 'env'), true),
          }
        : {}),
      ...process.env,
      NODE_ENV: 'production',
      TRAMVAI_CLI_COMMAND: 'static',
      CACHE_WARMUP_DISABLED: 'true',
      PORT: `${port}`,
      PORT_SERVER: `${port}`,
      TRAMVAI_CLI_ASSETS_PREFIX: staticAssetsPrefix,
      ASSETS_PREFIX: assetsPrefix ?? staticAssetsPrefix,
    },
  });

  server.catch((reason) => {
    context.logger.event({
      type: 'error',
      event: 'COMMAND:STATIC:BUILD',
      message: `message: server.js launch failed`,
      payload: reason,
    });
  });
  server.stdout.on('data', (chunk: Buffer) => {
    if (server.killed) {
      return;
    }

    handleServerOutput(context.logger, chunk);
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

  let paths = await appBundleInfo(serverConfigManager);

  if (options.onlyPages) {
    paths = intersection(paths, options.onlyPages);
  } else if (process.env.TRAMVAI_FORCE_CLIENT_SIDE_RENDERING === 'true') {
    // implicit connection with packages/modules/page-render-mode/src/ForceCSRModule.ts
    paths = ['/__csr_fallback__/'];
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

    const htmlServer = await startServer(serverConfigManager);

    await new Promise<void>((resolve) => {
      htmlServer.on('exit', () => {
        staticServer.close(() => resolve());
      });
    });
  } else {
    staticServer.close();
  }

  return {
    status: 'ok',
    message: 'application static generate success',
  };
};
