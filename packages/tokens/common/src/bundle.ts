import { createToken } from '@tinkoff/dippy';
import type { Bundle } from '@tramvai/core';

/**
 * @description
 * Хранилище бандлов. При получении бандла дополнительно добавляем экшены и компоненты из бандла в соответсвующие хранилища
 */
export const BUNDLE_MANAGER_TOKEN = createToken<BundleManager>('bundleManager');

/**
 * @description
 * Токен для предоставления дополнительных бандлов в приложение.
 * Важно! Не перезаписывает существующие бандлы.
 */
export const ADDITIONAL_BUNDLE_TOKEN = createToken<{ [key: string]: Bundle }>('additional bundle', {
  multi: true,
});

export interface BundleManager {
  bundles: Record<string, any>;

  get(name: string, pageComponent: string): Promise<any>;

  has(name: string, pageComponent: string): boolean;
}
