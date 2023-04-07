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
type BackgroundFetchService = ExtractDependencyType<typeof STATIC_PAGES_BACKGROUND_FETCH_SERVICE>;
type Cache = ExtractDependencyType<typeof STATIC_PAGES_CACHE_TOKEN>;
type ModifyCache = ExtractDependencyType<typeof STATIC_PAGES_MODIFY_CACHE> | null;
type Options = ExtractDependencyType<typeof STATIC_PAGES_OPTIONS_TOKEN>;
type Cache5xxResponse = ExtractDependencyType<typeof STATIC_PAGES_CACHE_5xx_RESPONSE>;

// It is critical to ignore cached Set-Cookie header and use fresh one from current request
// COMMAND_LINE_EXECUTION_END_TOKEN with fresh server timings will not works for responses from cache
const HEADERS_BLACKLIST = ['Set-Cookie', 'server-timing'];

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

  public shouldUseCache: () => boolean;

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
    this.shouldUseCache = () => shouldUseCache.every((fn) => fn());
    this.backgroundFetchService = backgroundFetchService;
    this.options = options;
    this.cache5xxResponse = cache5xxResponse;
  }

  respond(onSuccess: () => void) {
    if (!this.hasCache()) {
      this.log.debug({
        event: 'no-cache',
        key: this.key,
      });
      return;
    }

    let cacheEntry = this.getCache();

    if (Array.isArray(this.modifyCache)) {
      cacheEntry = this.modifyCache.reduce((result, modifier) => {
        return modifier(result);
      }, cacheEntry);
    }

    const { status, headers, body } = cacheEntry;
    const isOutdated = this.cacheOutdated(cacheEntry);
    const currentHeaders = this.responseManager.getHeaders();

    if (!isOutdated) {
      this.log.debug({
        event: 'cache-hit',
        key: this.key,
      });

      HEADERS_BLACKLIST.forEach((header) => {
        if (headers[header]) {
          delete headers[header];
        }
        if (currentHeaders[header]) {
          headers[header] = currentHeaders[header];
        }
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

  async revalidate() {
    if (!this.backgroundFetchService.enabled()) {
      return;
    }

    if (this.hasCache()) {
      const cacheEntry = this.getCache();
      const isOutdated = this.cacheOutdated(cacheEntry);

      if (!isOutdated) {
        return;
      }
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
          this.log.debug({
            event: 'cache-set-5xx',
            key: this.key,
          });
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
    this.log.debug({
      event: 'cache-set',
      key: this.key,
    });

    if (!this.cache.has(this.path)) {
      this.cache.set(this.path, new Map());
    }

    this.cache.get(this.path).set(this.key, {
      ...cacheEntry,
      updatedAt: Date.now(),
    });
  }

  private cacheOutdated(cacheEntry: StaticPagesCacheEntry): boolean {
    const { ttl } = this.options;
    const { updatedAt } = cacheEntry;

    const isOutdated = updatedAt + ttl <= Date.now();

    return isOutdated;
  }
}
