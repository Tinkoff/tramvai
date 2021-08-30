import { createToken } from '@tinkoff/dippy';
import type { Cache } from '@tramvai/tokens-common';
import type { ResourcesInlinerType } from './resourcesInliner';

/**
 * @description
 * Инлайнер ресурсов - используется на сервере для регистрации файлов, которые должны быть вставлены
 * в итоговую html-страницу в виде ссылки на файл или заинлайнеными полностью
 */
export const RESOURCE_INLINER = createToken<ResourcesInlinerType>('resourceInliner');

export type ResourcesRegistryCache = {
  filesCache: Cache; // Кеш файлов ресурсов
  sizeCache: Cache; // Кеш размеров файлов ресурсов
  requestsCache: Cache; // Кеш запросов файлов (для дедупликации)
};

/**
 * @description
 * Кэш загруженных ресурсов.
 */
export const RESOURCES_REGISTRY_CACHE = createToken<ResourcesRegistryCache>(
  'resourcesRegistryCache'
);
