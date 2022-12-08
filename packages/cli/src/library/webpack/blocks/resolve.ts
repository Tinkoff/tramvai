import type Config from 'webpack-chain';
import path from 'path';
import { existsSync } from 'fs';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import type { ConfigManager } from '../../../config/configManager';
import { extensions } from '../../../config/constants';

export default (configManager: ConfigManager) => (config: Config) => {
  const { rootDir, modern, buildType } = configManager;

  config.resolve.mainFields.merge(
    [
      ...(modern && buildType === 'client' ? ['es2017', 'es2016', 'es2015'] : []),
      buildType === 'client' && 'browser',
      'module',
      'main',
    ].filter(Boolean)
  );

  const tsconfigPath = path.resolve(rootDir, 'tsconfig.json');

  if (existsSync(tsconfigPath)) {
    config.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin, [
      {
        configFile: tsconfigPath,
        extensions,
        mainFields: config.resolve.mainFields.values(),
        silent: true,
      },
    ] as ConstructorParameters<typeof TsconfigPathsPlugin>);
  }

  config.resolve.extensions
    .merge(extensions)
    .end()
    .alias // TODO: удалить после обновлении версии pfp-block-rateOverview
    .set('packages/products/components', path.resolve(rootDir, 'apps/products/components'))
    .set('packages/pfpcards/components', path.resolve(rootDir, 'apps/pfpcards/components'))
    // Используется в платформе модулем tinkoff-offers версии ^2.4.9. Версия ^3.0.0 вместо этого
    // использует @tinkoff/platform-legacy, что тоже не вариант тянуть в платформу
    .set('offersContext', path.resolve(rootDir, 'packages/offers/dependencies'))
    .set(
      'appointmentContext',
      path.resolve(rootDir, 'apps/accounts/packages/appointment/dependencies')
    )
    .end()
    .modules.add('node_modules')
    .add(path.resolve(__dirname, '..', '..', '..', '..', 'node_modules'))
    .end()
    .end();
};
