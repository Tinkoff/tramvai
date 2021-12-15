import type { Container } from '@tinkoff/dippy';
import type {
  ChildAppDiManager,
  ChildAppPreloadManager,
  ChildAppRenderManager,
  ChildAppRequestConfig,
  CHILD_APP_RESOLVE_CONFIG_TOKEN,
} from '@tramvai/tokens-child-app';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';

export class RenderManager implements ChildAppRenderManager {
  private readonly preloadManager: ChildAppPreloadManager;
  private readonly diManager: ChildAppDiManager;
  private readonly resolveExternalConfig: typeof CHILD_APP_RESOLVE_CONFIG_TOKEN;
  private readonly log: ReturnType<typeof LOGGER_TOKEN>;
  private readonly hasRenderedSet = new Set<string>();
  private readonly loadingInProgress = new Map<string, ChildAppRequestConfig>();
  constructor({
    logger,
    preloadManager,
    diManager,
    resolveExternalConfig,
  }: {
    logger: typeof LOGGER_TOKEN;
    preloadManager: ChildAppPreloadManager;
    diManager: ChildAppDiManager;
    resolveExternalConfig: typeof CHILD_APP_RESOLVE_CONFIG_TOKEN;
  }) {
    this.log = logger('child-app:render');
    this.preloadManager = preloadManager;
    this.diManager = diManager;
    this.resolveExternalConfig = resolveExternalConfig;
  }

  getChildDi(request: ChildAppRequestConfig): [Container | null, null | Promise<Container | null>] {
    const config = this.resolveExternalConfig(request);

    this.hasRenderedSet.add(config.key);

    if (this.preloadManager.isPreloaded(request)) {
      return [this.diManager.getChildDi(config), null];
    }

    this.log.warn({
      message: 'Child-app has been used but not preloaded before React render',
      request,
    });

    this.loadingInProgress.set(config.key, config);

    const promiseDi = this.preloadManager.preload(request).then(() => {
      return this.diManager.getChildDi(config);
    });

    return [null, promiseDi];
  }

  async flush() {
    return false;
  }

  clear() {}
}
