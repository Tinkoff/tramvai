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
  private readonly resolveFullConfig: typeof CHILD_APP_RESOLVE_CONFIG_TOKEN;
  private readonly log: ReturnType<typeof LOGGER_TOKEN>;
  private readonly hasRenderedSet = new Set<string>();
  constructor({
    logger,
    preloadManager,
    diManager,
    resolveFullConfig,
  }: {
    logger: typeof LOGGER_TOKEN;
    preloadManager: ChildAppPreloadManager;
    diManager: ChildAppDiManager;
    resolveFullConfig: typeof CHILD_APP_RESOLVE_CONFIG_TOKEN;
  }) {
    this.log = logger('child-app:render');
    this.preloadManager = preloadManager;
    this.diManager = diManager;
    this.resolveFullConfig = resolveFullConfig;
  }

  getChildDi(
    request: ChildAppRequestConfig
  ): [Container | undefined, undefined | Promise<Container | undefined>] {
    const config = this.resolveFullConfig(request);

    if (!config) {
      throw new Error(`Child app "${request.name}" not found`);
    }

    this.hasRenderedSet.add(config.key);

    if (this.preloadManager.isPreloaded(request)) {
      return [this.diManager.getChildDi(config), undefined];
    }

    this.log.warn({
      message: 'Child-app has been used but not preloaded before React render',
      request,
    });

    return [undefined, undefined];
  }

  clear() {
    const preloadedList = this.preloadManager.getPreloadedList();

    for (const request of preloadedList) {
      const config = this.resolveFullConfig(request);

      if (!config || !this.hasRenderedSet.has(config.key)) {
        this.log.warn({
          message: 'Child-app has been preloaded but not used in React render',
          request,
        });
      }
    }

    this.hasRenderedSet.clear();
  }
}
