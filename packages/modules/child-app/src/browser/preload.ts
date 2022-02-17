import noop from '@tinkoff/utils/function/noop';
import type {
  ChildAppCommandLineRunner,
  ChildAppRequestConfig,
  ChildAppLoader,
  ChildAppPreloadManager,
  CHILD_APP_RESOLVE_CONFIG_TOKEN,
  ChildAppFinalConfig,
  CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN,
} from '@tramvai/tokens-child-app';
import type { STORE_TOKEN } from '@tramvai/tokens-common';
import { ChildAppStore } from '../shared/store';

export class PreloadManager implements ChildAppPreloadManager {
  private loader: ChildAppLoader;
  private runner: ChildAppCommandLineRunner;
  private store: typeof STORE_TOKEN;
  private resolutionConfigManager: typeof CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN;
  private resolveExternalConfig: typeof CHILD_APP_RESOLVE_CONFIG_TOKEN;

  private pageHasLoaded = false;
  private map = new Map<string, Promise<ChildAppFinalConfig>>();
  private serverPreloaded = new Map<string, ChildAppFinalConfig>();
  private preloadMap = new Map<string, ChildAppFinalConfig>();
  private hasInitialized = false;

  constructor({
    loader,
    runner,
    resolutionConfigManager,
    resolveExternalConfig,
    store,
  }: {
    loader: ChildAppLoader;
    runner: ChildAppCommandLineRunner;
    resolutionConfigManager: typeof CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN;
    resolveExternalConfig: typeof CHILD_APP_RESOLVE_CONFIG_TOKEN;
    store: typeof STORE_TOKEN;
  }) {
    this.loader = loader;
    this.runner = runner;
    this.store = store;
    this.resolutionConfigManager = resolutionConfigManager;
    this.resolveExternalConfig = resolveExternalConfig;
  }

  async preload(request: ChildAppRequestConfig): Promise<void> {
    await this.init();

    const config = this.resolveExternalConfig(request);
    const { key } = config;

    this.preloadMap.set(key, config);

    if (!this.map.has(key)) {
      if (this.pageHasLoaded) {
        const promise = (async () => {
          try {
            await this.loader.load(config);

            await this.run('customer', config);
            await this.run('clear', config);
          } catch (error) {}

          return config;
        })();

        this.map.set(key, promise);
      }
    }
  }

  isPreloaded(request: ChildAppRequestConfig): boolean {
    const config = this.resolveExternalConfig(request);
    const { key } = config;

    return this.map.has(key) || this.serverPreloaded.has(key);
  }

  async runPreloaded() {
    await this.init();

    const promises: Promise<void>[] = [];

    if (this.pageHasLoaded) {
      this.map.forEach((childAppPromise) => {
        promises.push(
          (async () => {
            await this.run('spa', await childAppPromise);
          })()
        );
      });
    } else {
      this.serverPreloaded.forEach((config) => {
        promises.push(
          (async () => {
            await this.loader.init(config);
            await this.run('customer', config);
          })()
        );
      });
    }

    await Promise.all(promises);
  }

  async clearPreloaded(): Promise<void> {
    this.pageHasLoaded = true;

    const promises: Promise<void>[] = [];

    this.preloadMap.forEach((config) => {
      promises.push(
        (async () => {
          if (this.serverPreloaded.has(config.key)) {
            promises.push(this.run('clear', config));
          } else {
            const promise = this.loader
              .load(config)
              .catch(noop)
              .then(() => config);

            this.map.set(config.key, promise);

            await promise;
            await this.run('customer', config);
            await this.run('clear', config);
          }
        })()
      );
    });

    this.serverPreloaded.clear();

    await Promise.all(promises);
  }

  getPreloadedList(): ChildAppRequestConfig[] {
    return [...this.preloadMap.values()];
  }

  private initServerPreloaded() {
    if (!this.hasInitialized) {
      const { preloaded } = this.store.getState(ChildAppStore);

      preloaded.forEach((request) => {
        const config = this.resolveExternalConfig(request);
        this.serverPreloaded.set(config.key, config);
      });

      this.hasInitialized = true;
    }
  }

  private async init() {
    await this.resolutionConfigManager.init();
    this.initServerPreloaded();
  }

  private async run(status: string, config: ChildAppFinalConfig) {
    const childApp = this.loader.get(config);

    if (!childApp) {
      return;
    }

    await this.runner.run('client', status, config);
  }
}
