import noop from '@tinkoff/utils/function/noop';
import type {
  ChildAppCommandLineRunner,
  ChildAppRequestConfig,
  ChildAppLoader,
  ChildAppPreloadManager,
  ChildAppStateManager,
  CHILD_APP_RESOLVE_CONFIG_TOKEN,
  ChildAppFinalConfig,
  CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN,
} from '@tramvai/tokens-child-app';

export class PreloadManager implements ChildAppPreloadManager {
  private loader: ChildAppLoader;
  private runner: ChildAppCommandLineRunner;
  private stateManager: ChildAppStateManager;
  private resolutionConfigManager: typeof CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN;
  private readonly resolveFullConfig: typeof CHILD_APP_RESOLVE_CONFIG_TOKEN;

  private shouldRunImmediately = false;
  private map = new Map<string, Promise<ChildAppFinalConfig>>();
  private preloadMap = new Map<string, ChildAppFinalConfig>();

  constructor({
    loader,
    runner,
    stateManager,
    resolutionConfigManager,
    resolveFullConfig,
  }: {
    loader: ChildAppLoader;
    runner: ChildAppCommandLineRunner;
    stateManager: ChildAppStateManager;
    resolutionConfigManager: typeof CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN;
    resolveFullConfig: typeof CHILD_APP_RESOLVE_CONFIG_TOKEN;
  }) {
    this.loader = loader;
    this.runner = runner;
    this.stateManager = stateManager;
    this.resolutionConfigManager = resolutionConfigManager;
    this.resolveFullConfig = resolveFullConfig;
  }

  async preload(request: ChildAppRequestConfig): Promise<void> {
    await this.resolutionConfigManager.init();

    const config = this.resolveFullConfig(request);
    const { key } = config;

    if (this.map.has(key)) {
      await this.map.get(key);
      return;
    }

    const promise = this.loader
      .load(config)
      .then(() => {
        if (this.shouldRunImmediately) {
          return this.run('customer', config);
        }
      })
      .catch(noop)
      .then(() => config);

    this.map.set(key, promise);
    this.preloadMap.set(config.key, config);

    if (this.shouldRunImmediately) {
      await promise;
    }
  }

  isPreloaded(request: ChildAppRequestConfig): boolean {
    const config = this.resolveFullConfig(request);
    const { key } = config;

    return this.map.has(key);
  }

  async runPreloaded() {
    this.shouldRunImmediately = true;
    const promises: Promise<void>[] = [];
    this.map.forEach((childAppPromise) => {
      promises.push(
        (async () => {
          await this.run('customer', await childAppPromise);
        })()
      );
    });

    await Promise.all(promises);
  }

  pageRender(): void {}

  async clearPreloaded(): Promise<void> {
    const promises: Promise<void>[] = [];
    this.map.forEach((childAppPromise) => {
      promises.push(
        (async () => {
          await this.run('clear', await childAppPromise);
        })()
      );
    });

    await Promise.all(promises);
  }

  getPreloadedList(): ChildAppRequestConfig[] {
    return [...this.preloadMap.values()];
  }

  private async run(status: string, config: ChildAppFinalConfig) {
    const childApp = this.loader.get(config);

    if (!childApp) {
      return;
    }

    await this.runner.run('server', status, config);
    await this.stateManager.registerChildApp(config);
  }
}
