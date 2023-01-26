import type { ChildApp } from '@tramvai/child-app-core';
import { ServerLoader as LowLevelLoader } from '@tinkoff/module-loader-server';
import type { ChildAppFinalConfig } from '@tramvai/tokens-child-app';
import type { CREATE_CACHE_TOKEN, LOGGER_TOKEN, Cache } from '@tramvai/tokens-common';
import { Loader } from '../shared/loader';
import type { ModuleFederationContainer } from '../shared/webpack/moduleFederation';
import { initModuleFederation } from '../shared/webpack/moduleFederation';
import { getModuleFederation } from '../shared/webpack/moduleFederation';
import type { ChildAppModuleWrapper } from '../shared/types/module';

export class ServerLoader extends Loader {
  private readonly loader: LowLevelLoader;
  private readonly initializedMap = new WeakMap<ModuleFederationContainer, ChildAppModuleWrapper>();
  private internalLoadCache: Cache; // used to clear cache for debug
  constructor({
    logger,
    createCache,
  }: {
    logger: typeof LOGGER_TOKEN;
    createCache: typeof CREATE_CACHE_TOKEN;
  }) {
    super();
    const cache = createCache('memory', {
      ttl: 1000 * 60 * 60 * 24 * 5,
      max: 20,
    });

    this.internalLoadCache = cache;
    this.loader = new LowLevelLoader({
      cache,
      log: logger('child-app:loader'),
    });
  }

  async load(config: ChildAppFinalConfig): Promise<ChildApp | void> {
    await this.loader.resolveByUrl<ModuleFederationContainer>(config.server.entry, {
      codePrefix: `var ASSETS_PREFIX="${config.client.baseUrl}";`,
      displayName: config.name,
      kind: 'child-app',
    });

    await this.init(config);

    if (config.tag === 'debug') {
      setTimeout(() => {
        this.internalLoadCache.set(config.server.entry, null);
      }, 10000);
    }

    return this.get(config);
  }

  async init(config: ChildAppFinalConfig): Promise<void> {
    const container = this.loader.getByUrl<ModuleFederationContainer>(config.server.entry);

    if (container) {
      await initModuleFederation(container, 'default');

      const factory = (await getModuleFederation(
        container,
        'entry'
      )) as () => ChildAppModuleWrapper;
      const entry = factory();

      this.initializedMap.set(container, entry);
    }
  }

  get(config: ChildAppFinalConfig): ChildApp | void {
    const container = this.loader.getByUrl<ModuleFederationContainer>(config.server.entry);

    return container && this.resolve(this.initializedMap.get(container)!);
  }
}
