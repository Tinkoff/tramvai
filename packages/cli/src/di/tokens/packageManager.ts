import { createToken } from '@tinkoff/dippy';
import type { PackageManager } from '@tinkoff/package-manager-wrapper';

/**
 * Сервис для работы с зависимостями внутри CLI
 */
export const CLI_PACKAGE_MANAGER = createToken<PackageManager>('cli package manager');

/**
 * Сервис для работы с зависимостями внутри приложения
 */
export const APPLICATION_PACKAGE_MANAGER = createToken<PackageManager>(
  'application package manager'
);
