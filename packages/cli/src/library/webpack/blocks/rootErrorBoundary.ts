import fs from 'fs';
import path from 'path';
import type Config from 'webpack-chain';

import type { ConfigManager } from '../../../config/configManager';

const ROOT_ERROR_BOUNDARY_CHUNK_NAME = 'rootErrorBoundary';
const ROOT_ERROR_BOUNDARY_ALIAS = '@/__private__/error';

export const rootErrorBoundaryFactory = (configManager: ConfigManager) => (config: Config) => {
  const { root, rootDir, buildType } = configManager;
  const rootErrorBoundaryPath = path.resolve(rootDir, root, 'error.tsx');
  const fakeErrorBoundaryModule = require.resolve('../application/fakeRootErrorBoundaryModule');
  const doesErrorBoundaryExist = fs.existsSync(rootErrorBoundaryPath);

  if (doesErrorBoundaryExist) {
    config
      .when(
        buildType === 'client',
        // We don't need additional entrypoint on the server
        (client) => client.entry(ROOT_ERROR_BOUNDARY_CHUNK_NAME).add(fakeErrorBoundaryModule),
        (server) =>
          // Hack that allows to require a root error boundary module on the server
          server.resolve.alias.set(ROOT_ERROR_BOUNDARY_ALIAS, rootErrorBoundaryPath)
      )
      .module.rule('root-error-boundary')
      .enforce('pre')
      .test(new RegExp(fakeErrorBoundaryModule))
      .use('root-error-boundary-loader')
      .loader(path.resolve(__dirname, '..', 'loaders', 'root-error-boundary-loader'))
      .options({ path: rootErrorBoundaryPath, buildType });
  }
};
