import { fork } from 'child_process';
import path from 'path';
import safeRequire from '../../utils/safeRequire';
import type { ConfigManager } from '../../config/configManager';
import { DEBUG_ARGV } from '../../config/constants';

export const startServer = async (configManager: ConfigManager) => {
  const {
    debug,
    port,
    staticPort,
    staticHost,
    build: {
      options: { outputClient },
    },
  } = configManager;
  const root = configManager.getBuildPath();

  return fork(path.resolve(root, 'server.js'), [], {
    execArgv: debug ? DEBUG_ARGV : [],
    cwd: root,
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
};
