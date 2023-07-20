import type { PrecacheEntry } from 'workbox-precaching';
import type { Strategy, StrategyOptions } from 'workbox-strategies';

export interface ApplicationAssetsCacheOptions {
  precacheManifest?: Array<string | PrecacheEntry>;
  maxEntries?: number;
  maxAgeSeconds?: number;
  strategy?: StrategyConstructor;
}

export interface StrategyConstructor {
  new (options: StrategyOptions & Record<string, any>): Strategy;
}

export interface WarmStrategyCacheOptions {
  urls: Array<string | PrecacheEntry>;
  type: ResourcesTypes | ResourcesTypes[];
  strategy: Strategy;
}

export type ResourcesTypes = 'script' | 'style' | 'image' | 'font' | 'manifest' | 'html';
