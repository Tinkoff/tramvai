import type { ExtractDependencyType } from '@tinkoff/dippy';
import type { USER_AGENT_TOKEN } from '@tramvai/module-client-hints';
import type {
  ENV_MANAGER_TOKEN,
  LOGGER_TOKEN,
  REQUEST_MANAGER_TOKEN,
  RESPONSE_MANAGER_TOKEN,
} from '@tramvai/tokens-common';
import type { FASTIFY_RESPONSE } from '@tramvai/tokens-server-private';
import type { MODERN_SATISFIES_TOKEN } from '@tramvai/tokens-render';
import type {
  STATIC_PAGES_BACKGROUND_FETCH_SERVICE,
  STATIC_PAGES_GET_CACHE_KEY_TOKEN,
} from '../staticPages';
import type {
  STATIC_PAGES_SHOULD_USE_CACHE,
  STATIC_PAGES_SHOULD_SET_TO_CACHE,
  StaticPagesCacheEntry,
  STATIC_PAGES_CACHE_TOKEN,
  STATIC_PAGES_MODIFY_CACHE,
  STATIC_PAGES_OPTIONS_TOKEN,
  STATIC_PAGES_CACHE_5xx_RESPONSE,
} from '../tokens';

type ResponseManager = ExtractDependencyType<typeof RESPONSE_MANAGER_TOKEN>;
type Response = ExtractDependencyType<typeof FASTIFY_RESPONSE>;
type Logger = ExtractDependencyType<typeof LOGGER_TOKEN>;
type ShouldUseCache = ExtractDependencyType<typeof STATIC_PAGES_SHOULD_USE_CACHE>;
type ShouldSetToCache = ExtractDependencyType<typeof STATIC_PAGES_SHOULD_SET_TO_CACHE>;
type BackgroundFetchService = ExtractDependencyType<typeof STATIC_PAGES_BACKGROUND_FETCH_SERVICE>;
type Cache = ExtractDependencyType<typeof STATIC_PAGES_CACHE_TOKEN>;
type ModifyCache = ExtractDependencyType<typeof STATIC_PAGES_MODIFY_CACHE> | null;
type Options = ExtractDependencyType<typeof STATIC_PAGES_OPTIONS_TOKEN>;
type Cache5xxResponse = ExtractDependencyType<typeof STATIC_PAGES_CACHE_5xx_RESPONSE>;

export class StaticPagesService {
  readonly key: string;
  readonly path: string;
  readonly port: string;
  readonly deviceType: string;
  readonly modern: string;

  private responseManager: ResponseManager;
  private response: Response;
  private log: ReturnType<Logger>;
  private cache: Cache;
  private modifyCache: ModifyCache;
  private backgroundFetchService: BackgroundFetchService;
  private options: Options;
  private cache5xxResponse: Cache5xxResponse;

  public shouldUseCache: ShouldUseCache;
  public shouldSetToCache: ShouldSetToCache;

  constructor({
    getCacheKey,
    requestManager,
    response,
    responseManager,
    environmentManager,
    userAgent,
    modern,
    logger,
    cache,
    modifyCache,
    shouldUseCache,
    shouldSetToCache,
    backgroundFetchService,
    options,
    cache5xxResponse,
  }: {
    getCacheKey: ExtractDependencyType<typeof STATIC_PAGES_GET_CACHE_KEY_TOKEN>;
    requestManager: ExtractDependencyType<typeof REQUEST_MANAGER_TOKEN>;
    responseManager: ResponseManager;
    response: Response;
    environmentManager: ExtractDependencyType<typeof ENV_MANAGER_TOKEN>;
    userAgent: ExtractDependencyType<typeof USER_AGENT_TOKEN>;
    modern: ExtractDependencyType<typeof MODERN_SATISFIES_TOKEN>;
    logger: Logger;
    cache: Cache;
    modifyCache: ModifyCache;
    shouldUseCache: ShouldUseCache;
    shouldSetToCache: ShouldSetToCache;
    backgroundFetchService: BackgroundFetchService;
    options: Options;
    cache5xxResponse: Cache5xxResponse;
  }) {
    this.key = getCacheKey();
    this.path = requestManager.getParsedUrl().pathname;
    this.port = environmentManager.get('PORT');
    this.deviceType = userAgent.mobileOS ? 'mobile' : 'desktop';
    this.modern = modern ? 'modern' : 'default';
    this.log = logger('static-pages');
    this.responseManager = responseManager;
    this.response = response;
    this.cache = cache;
    this.modifyCache = modifyCache;
    this.shouldUseCache = shouldUseCache;
    this.shouldSetToCache = shouldSetToCache;
    this.backgroundFetchService = backgroundFetchService;
    this.options = options;
    this.cache5xxResponse = cache5xxResponse;
  }

  respond(onSuccess: () => void) {
    if (!this.hasCache()) {
      return;
    }

    const { ttl } = this.options;
    let cacheEntry = this.getCache();

    if (Array.isArray(this.modifyCache)) {
      cacheEntry = this.modifyCache.reduce((result, modifier) => {
        return modifier(result);
      }, cacheEntry);
    }

    const { updatedAt, status, headers, body } = cacheEntry;
    const isOutdated = updatedAt + ttl <= Date.now();

    if (!isOutdated) {
      this.log.debug({
        event: 'cache-hit',
        key: this.key,
      });

      this.response
        .header('content-type', 'text/html')
        .header('X-Tramvai-Static-Page-From-Cache', 'true')
        .headers(headers)
        .status(status)
        .send(body);

      onSuccess();
    } else {
      this.log.debug({
        event: 'cache-outdated',
        key: this.key,
      });
    }
  }

  saveResponse() {
    if (!this.cache5xxResponse() && this.responseManager.getStatus() >= 500) {
      this.log.debug({
        event: 'cache-set-5xx',
        key: this.key,
      });
      return;
    }

    this.log.debug({
      event: 'cache-set',
      key: this.key,
    });

    this.setCache({
      status: this.responseManager.getStatus(),
      headers: this.responseManager.getHeaders(),
      body: this.responseManager.getBody() as string,
    });
  }

  async revalidate() {
    if (!this.backgroundFetchService.enabled()) {
      return;
    }

    await this.backgroundFetchService
      .revalidate({
        key: this.key,
        path: this.path,
        port: this.port,
        deviceType: this.deviceType,
        modern: this.modern,
      })
      .then((response) => {
        if (!response) {
          return;
        }
        if (!this.cache5xxResponse() && response.status >= 500) {
          return;
        }
        this.setCache(response);
      });
  }

  private hasCache() {
    return this.cache.has(this.path) && this.cache.get(this.path).has(this.key);
  }

  private getCache() {
    return this.cache.get(this.path).get(this.key);
  }

  private setCache(cacheEntry: Omit<StaticPagesCacheEntry, 'updatedAt'>) {
    if (!this.cache.has(this.path)) {
      this.cache.set(this.path, new Map());
    }

    this.cache.get(this.path).set(this.key, {
      ...cacheEntry,
      updatedAt: Date.now(),
    });
  }
}
