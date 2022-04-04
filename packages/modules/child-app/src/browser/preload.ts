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

  private pageHasRendered = false;
  private pageHasLoaded = false;
  private currentlyPreloaded = new Map<string, ChildAppFinalConfig>();
  private hasPreloadBefore = new Set<string>();
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

    if (!this.isPreloaded(config)) {
      // in case React render yet has not been executed do not load any external child-app app as
      // as it will lead to markup mismatch on markup hydration
      if (this.pageHasRendered) {
        // but in case render has happened load child-app as soon as possible
        try {
          await this.loader.load(config);

          await this.run('customer', config);
          await this.run('clear', config);
          this.hasPreloadBefore.add(key);
        } catch (error) {}
      }
    }

    if (this.pageHasRendered) {
      this.currentlyPreloaded.set(key, config);
    }
  }

  isPreloaded(request: ChildAppRequestConfig): boolean {
    const config = this.resolveExternalConfig(request);
    const { key } = config;

    return this.hasPreloadBefore.has(key);
  }

  async runPreloaded() {
    await this.init();

    if (this.pageHasRendered) {
      return;
    }

    const promises: Promise<void>[] = [];

    this.currentlyPreloaded.forEach((config) => {
      promises.push(
        (async () => {
          await this.loader.init(config);
          await this.run('customer', config);
        })()
      );
    });

    await Promise.all(promises);
  }

  pageRender(): void {
    this.pageHasRendered = true;
  }

  async clearPreloaded(): Promise<void> {
    if (this.pageHasLoaded) {
      this.currentlyPreloaded.clear();
      return;
    }

    this.pageHasLoaded = true;

    const promises: Promise<void>[] = [];

    this.currentlyPreloaded.forEach((config) => {
      promises.push(this.run('clear', config));
    });

    this.currentlyPreloaded.clear();

    await Promise.all(promises);
  }

  getPreloadedList(): ChildAppFinalConfig[] {
    return Array.from(this.currentlyPreloaded.values());
  }

  private initServerPreloaded() {
    if (!this.hasInitialized) {
      const { preloaded } = this.store.getState(ChildAppStore);

      preloaded.forEach((request) => {
        const config = this.resolveExternalConfig(request);
        this.currentlyPreloaded.set(config.key, config);
        this.hasPreloadBefore.add(config.key);
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
