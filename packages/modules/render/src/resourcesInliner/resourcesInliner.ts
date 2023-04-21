import isUndefined from '@tinkoff/utils/is/undefined';
import isEmpty from '@tinkoff/utils/is/empty';
import type { PageResource, RESOURCE_INLINE_OPTIONS } from '@tramvai/tokens-render';
import { ResourceType } from '@tramvai/tokens-render';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { isAbsoluteUrl } from '@tinkoff/url';
import { getFile, getFileContentLength } from './externalFilesHelper';
import type { RESOURCES_REGISTRY_CACHE } from './tokens';
import { processFile } from './fileProcessor';

const INTERNAL_CACHE_SIZE = 50;

const TRAMVAI_CLI_ASSETS_PREFIX = `${process.env.TRAMVAI_CLI_ASSETS_PREFIX}`;

const ASSETS_PREFIX =
  process.env.NODE_ENV === 'development' &&
  (process.env.ASSETS_PREFIX === 'static' || !process.env.ASSETS_PREFIX)
    ? TRAMVAI_CLI_ASSETS_PREFIX
    : process.env.ASSETS_PREFIX;

const getInlineType = (type: PageResource['type']) => {
  switch (type) {
    case ResourceType.style:
      return ResourceType.inlineStyle;
    case ResourceType.script:
      return ResourceType.inlineScript;
    default:
      return type;
  }
};

const getResourceUrl = (resource: PageResource) => {
  if (isEmpty(resource.payload) || !isAbsoluteUrl(resource.payload)) {
    return undefined;
  }

  let result = resource.payload.startsWith('//') ? `https:${resource.payload}` : resource.payload;

  if (process.env.TRAMVAI_CLI_COMMAND === 'static' && result.startsWith(ASSETS_PREFIX)) {
    result = result.replace(ASSETS_PREFIX, TRAMVAI_CLI_ASSETS_PREFIX);
  }

  return result;
};

export interface ResourcesInlinerType {
  shouldAddResource(resource: PageResource): boolean;
  shouldInline(resource: PageResource): boolean;

  inlineResource(resource: PageResource): PageResource[];
  prefetchResource(resource: PageResource): Promise<void>;
}

export class ResourcesInliner implements ResourcesInlinerType {
  private resourceInlineThreshold?: typeof RESOURCE_INLINE_OPTIONS;
  private internalFilesCache = new Map<string, string>();
  private resourcesRegistryCache: typeof RESOURCES_REGISTRY_CACHE;
  private log: ReturnType<typeof LOGGER_TOKEN>;
  private runningRequests = new Set<string>();

  private scheduleFileLoad = async (resource: PageResource, resourceInlineThreshold: number) => {
    const url = getResourceUrl(resource);
    const requestKey = `file${url}`;

    const filesCache = this.getFilesCache(url);
    const result = filesCache.get(url);

    if (result) {
      return result;
    }

    if (!this.runningRequests.has(requestKey)) {
      this.runningRequests.add(url);

      try {
        const file = await getFile(url);

        if (file === undefined) {
          this.resourcesRegistryCache.disabledUrlsCache.set(url, true);
          return;
        }

        const size = file.length;

        if (size < resourceInlineThreshold) {
          filesCache.set(url, processFile(resource, file));
        }

        this.resourcesRegistryCache.sizeCache.set(url, size);
      } catch (error) {
        this.log.warn({
          event: 'file-load-failed',
          url,
          error,
        });
      } finally {
        this.runningRequests.delete(requestKey);
      }
    }
  };

  private scheduleFileSizeLoad = async (
    resource: PageResource,
    resourceInlineThreshold: number,
    waitForFileLoad?: boolean
  ) => {
    const url = getResourceUrl(resource);
    const requestKey = `size${url}`;

    const result = this.resourcesRegistryCache.sizeCache.get(url);

    if (result) {
      return result;
    }

    if (!this.runningRequests.has(requestKey)) {
      this.runningRequests.add(requestKey);

      try {
        const contentLength = await getFileContentLength(url);

        const size = isUndefined(contentLength) ? 0 : +contentLength;

        if (size) {
          this.resourcesRegistryCache.sizeCache.set(url, size);
        }

        if (size < resourceInlineThreshold) {
          const promise = this.scheduleFileLoad(resource, resourceInlineThreshold);

          if (waitForFileLoad) {
            await promise;
          }
        }
      } catch (error) {
        // If the ASSETS_PREFIX variable does not exist,
        // or static files weren't deployed yet, we can't get
        // information about files.
        this.log.debug({
          event: 'file-content-length-load-failed',
          url,
          error,
        });
      } finally {
        this.runningRequests.delete(requestKey);
      }
    }
  };

  constructor({ resourcesRegistryCache, resourceInlineThreshold, logger }) {
    this.resourcesRegistryCache = resourcesRegistryCache;
    this.resourceInlineThreshold = resourceInlineThreshold;
    this.log = logger('resources-inliner');
  }

  private getFilesCache(url: string) {
    if (
      url.startsWith(ASSETS_PREFIX) ||
      // reverse logic for `static` command in `getResourceUrl` method
      (process.env.TRAMVAI_CLI_COMMAND === 'static' && url.startsWith(TRAMVAI_CLI_ASSETS_PREFIX))
    ) {
      // internal resources are resources generated by the current app itself
      // these kind of resources are pretty static and won't be changed while app is running
      // so we can cache it with bare Map and do not care about how to cleanup cache from outdated entries
      return this.internalFilesCache;
    }

    return this.resourcesRegistryCache.filesCache;
  }

  // check that resource's preload-link should be added to render
  shouldAddResource(resource: PageResource) {
    if (resource.type !== ResourceType.preloadLink) {
      // only checking preload-links
      return true;
    }

    const url = getResourceUrl(resource);

    if (isUndefined(url)) {
      // if url is undefined that file is not in cache
      return true;
    }
    // if file is residing in cache that means it will be inlined in page render
    // therefore no need to have preload-link for the inlined resource
    return !this.getFilesCache(url).has(url);
  }

  // method for check is passed resource should be inlined in HTML-page
  shouldInline(resource: PageResource) {
    if (!(this.resourceInlineThreshold?.types || []).includes(resource.type)) {
      return false;
    }
    const resourceInlineThreshold = this.resourceInlineThreshold.threshold;

    if (isUndefined(resourceInlineThreshold)) {
      return false;
    }

    const url = getResourceUrl(resource);

    if (isUndefined(url) || this.resourcesRegistryCache.disabledUrlsCache.has(url)) {
      return false;
    }

    const filesCache = this.getFilesCache(url);

    if (filesCache.has(url)) {
      return true;
    }

    if (
      filesCache === this.internalFilesCache &&
      this.internalFilesCache.size >= INTERNAL_CACHE_SIZE
    ) {
      // if we've exceeded limits for the internal resources cache ignore any new entries
      return false;
    }

    if (!this.resourcesRegistryCache.sizeCache.has(url)) {
      this.scheduleFileSizeLoad(resource, resourceInlineThreshold);
      return false;
    }

    const size = this.resourcesRegistryCache.sizeCache.get(url);

    if (size > resourceInlineThreshold) {
      return false;
    }

    this.scheduleFileLoad(resource, resourceInlineThreshold);
    return false;
  }

  inlineResource(resource: PageResource): PageResource[] {
    const url = getResourceUrl(resource);
    if (isUndefined(url)) {
      // usually, it should not happen but anyway check it for safety
      return [resource];
    }
    const text = this.getFilesCache(url).get(url);

    if (isEmpty(text)) {
      return [resource];
    }

    const result = [];
    if (process.env.NODE_ENV === 'development') {
      // html comment for debugging inlining in dev mode
      result.push({
        slot: resource.slot,
        type: ResourceType.asIs,
        payload: `<!-- Inlined file ${url} -->`,
      });
    }
    result.push({
      ...resource,
      type: getInlineType(resource.type),
      payload: text,
    });
    if (resource.type === ResourceType.style) {
      // If we don't add data-href then extract-css-chunks-webpack-plugin
      // will add link to resources to the html head (https://github.com/faceyspacey/extract-css-chunks-webpack-plugin/blob/master/src/index.js#L346)
      // wherein link in case of css files plugin will look for a link tag, but we add a style tag
      // so we can't use tag from above and have to generate new one
      result.push({
        slot: resource.slot,
        type: ResourceType.style,
        payload: null,
        attrs: {
          'data-href': resource.payload,
        },
      });
    }
    return result;
  }

  async prefetchResource(resource: PageResource): Promise<void> {
    const url = getResourceUrl(resource);
    const resourceInlineThreshold = this.resourceInlineThreshold.threshold;

    if (
      isUndefined(url) ||
      isUndefined(resourceInlineThreshold) ||
      this.resourcesRegistryCache.disabledUrlsCache.has(url)
    ) {
      return;
    }

    if (!this.resourcesRegistryCache.sizeCache.has(url)) {
      await this.scheduleFileSizeLoad(resource, resourceInlineThreshold, true);
    }
  }
}
