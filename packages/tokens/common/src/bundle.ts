import { createToken } from '@tinkoff/dippy';
import type { Bundle } from '@tramvai/core';

/**
 * @description
 * Bundle Storage. When getting bundle additionally adds actions and components from bundle to according storages
 */
export const BUNDLE_MANAGER_TOKEN = createToken<BundleManager>('bundleManager');

/**
 * @description
 * Provides additional bundles to the app.
 * Important! This token doesn't overrides already existing bundles.
 */
export const ADDITIONAL_BUNDLE_TOKEN = createToken<{ [key: string]: Bundle }>('additional bundle', {
  multi: true,
});

export interface BundleManager {
  bundles: Record<string, any>;

  get(name: string, pageComponent: string): Promise<any>;

  has(name: string, pageComponent: string): boolean;
}
