import Module from 'module';
import { runInThisContext } from 'vm';
import ssri from 'ssri';
import { makeRequest } from './request';
import { DEFAULT_LOGGER, DEFAULT_TIMEOUT } from './defaults';
import type { Logger, RequestFunc, LoaderDeps, LoadOptions, Cache } from './types.h';

// Высчитываем размер обёртки для модулей в которую оборачивается модуль, вычитая конечную часть `\n});`
// это нужно чтобы стектрейсы правильно указывали на фрагмент кода
const MODULE_WRAP_LENGTH = Module.wrap('').length - 4;

const nodeRequire =
  // @ts-ignore
  typeof __non_webpack_require__ === 'undefined' ? require : __non_webpack_require__;

interface AbstractModule {
  exports: any;
}

const createDefaultCache = (): Cache => {
  const cache = Object.create(null);

  return {
    get: (key) => cache[key],
    set: (key, entry) => {
      cache[key] = entry;
    },
  };
};

export class ServerLoader {
  protected log: Logger;

  protected cache: Cache;

  protected request: RequestFunc;

  protected externals: Record<string, any>;

  protected fetchRequests: Map<string, Promise<any>>;

  protected timeout: number;

  constructor(deps: LoaderDeps = {}) {
    this.log = deps.log || DEFAULT_LOGGER;
    this.cache = deps.cache || createDefaultCache();
    this.request = deps.request || makeRequest();
    this.externals = deps.externals || {};
    this.fetchRequests = new Map();
    this.timeout = deps.timeout || DEFAULT_TIMEOUT;
  }

  getByUrl<R = any>(url: string, options: LoadOptions = {}): R | void {
    const key = this.getCacheKey(url, options);
    return this.cache.get(key);
  }

  loadByUrl<R = any>(url: string, options: LoadOptions = {}): R | Promise<R> {
    const key = this.getCacheKey(url, options);
    const mod: R | void = this.cache.get(key);
    const { displayName: displayNameIn, kind = 'module' } = options;
    const displayName = displayNameIn ? `${kind} "${displayNameIn}"` : kind;

    if (mod) {
      this.log.debug(`${displayName} url=${url} returned from cache`);

      return mod;
    }

    this.log.debug(`Start fetching ${displayName} from ${url}`);

    const isAlreadyFetching = this.fetchRequests.has(url);

    if (isAlreadyFetching) {
      return this.fetchRequests.get(url) || Promise.resolve();
    }

    const { integrity, codePrefix } = options;

    const fetchRequest = this.fetchFromUrl(url)
      .then((code) => {
        if (integrity && !ssri.checkData(code, integrity)) {
          throw new Error(
            `EINTEGRITY: ${displayName} from ${url} doesn't match integrity ${integrity}`
          );
        }
        const moduleInstance = this.requireFromString(code, { key, url, codePrefix });

        this.log.debug(`${displayName} ${url} successfully parsed`);

        this.cache.set(key, moduleInstance);

        return moduleInstance;
      })
      .catch((err) => {
        this.log.error({
          error: err,
          url,
          name: displayName,
        });
        throw new Error(`Error resolving ${displayName} from ${url}`);
      });

    this.fetchRequests.set(url, fetchRequest);

    fetchRequest
      .then(() => this.fetchRequests.delete(url))
      .catch(() => this.fetchRequests.delete(url));

    return fetchRequest;
  }

  // специальный метод, который для удобства всегда возвращает промис
  resolveByUrl<R = any>(url: string, options: LoadOptions = {}): Promise<R> {
    return Promise.resolve(this.loadByUrl<R>(url, options));
  }

  // eslint-disable-next-line class-methods-use-this
  protected getCacheKey(url: string, options?: LoadOptions) {
    return url;
  }

  protected fetchFromUrl(url: string) {
    return this.request({
      url,
      responseType: 'buffer',
      timeout: this.timeout,
    }).then((response) => {
      this.log.debug(`${url} loaded`);
      return response;
    });
  }

  protected require(name: string) {
    return this.externals[name] || nodeRequire(name);
  }

  protected requireFromString<R = any>(
    code: string,
    { key, url, codePrefix = '' }: { key: string; url: string; codePrefix?: string }
  ): R {
    const newModule: AbstractModule = { exports: {} };

    runInThisContext(Module.wrap(codePrefix + code), {
      filename: url,
      columnOffset: -MODULE_WRAP_LENGTH,
    })(
      newModule.exports,
      (name: string) => this.require(name),
      newModule,
      `${__dirname}/${key}`,
      __dirname
    );

    return newModule.exports;
  }
}
