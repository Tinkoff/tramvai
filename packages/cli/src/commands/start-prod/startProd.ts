import buildCommand from '../build/build';
import type { Context } from '../../models/context';
import type { CommandResult } from '../../models/command';
import { ConfigManager } from '../../config/configManager';
import type { Params } from './command';
import { startServer } from './server';
import { startStaticServer } from './staticServer';

export const startProd = async (context: Context, parameters: Params): Promise<CommandResult> => {
  const { target } = parameters;
  const configEntry = context.config.getProject(target);
  const clientConfigManager = new ConfigManager(configEntry, {
    env: 'production',
    ...parameters,
    buildType: 'client',
  });
  const serverConfigManager = clientConfigManager.withSettings({
    buildType: 'server',
  });

  if (parameters.buildType !== 'none') {
    await buildCommand(context, parameters);
  }

  switch (clientConfigManager.type) {
    case 'application': {
      const staticServer = await startStaticServer(clientConfigManager);
      const server = await startServer(serverConfigManager);

      return new Promise((resolve) => {
        server.on('exit', () => {
          staticServer.close(() => resolve({ status: 'ok' }));
        });
      });
    }
    case 'module': {
      const staticServer = await startStaticServer(clientConfigManager);

      return new Promise((resolve) => {
        staticServer.on('exit', resolve);
      });
    }
    case 'package': {
      return Promise.reject(new Error('package not supported'));
    }
  }
};
