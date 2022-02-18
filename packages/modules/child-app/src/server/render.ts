import { renderToString } from 'react-dom/server';
import type { CUSTOM_RENDER } from '@tramvai/tokens-render';
import type { Container } from '@tinkoff/dippy';
import { CHILD_APP_INTERNAL_BEFORE_RENDER_TOKEN } from '@tramvai/tokens-child-app';
import type {
  ChildAppDiManager,
  ChildAppFinalConfig,
  ChildAppPreloadManager,
  ChildAppRenderManager,
  ChildAppRequestConfig,
  CHILD_APP_RESOLVE_CONFIG_TOKEN,
} from '@tramvai/tokens-child-app';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';

const LOAD_TIMEOUT = 500;

export const customRender = ({
  renderManager,
  diManager,
}: {
  renderManager: ChildAppRenderManager;
  diManager: ChildAppDiManager;
}): typeof CUSTOM_RENDER => {
  return async (content) => {
    const promises: Promise<void[]>[] = [];
    diManager.forEachChildDi((di) => {
      const beforeAppRender = (di.get(
        CHILD_APP_INTERNAL_BEFORE_RENDER_TOKEN
      ) as any) as typeof CHILD_APP_INTERNAL_BEFORE_RENDER_TOKEN[];

      if (beforeAppRender) {
        promises.push(Promise.all(beforeAppRender.map((fn) => fn())));
      }
    });
    await Promise.all(promises);
    let render = renderToString(content);
    let timeouted = false;

    await Promise.race([
      new Promise((resolve) => setTimeout(resolve, LOAD_TIMEOUT)),
      (async () => {
        while ((await renderManager.flush()) && !timeouted) {
          render = renderToString(content);
        }
      })(),
    ]);

    timeouted = true;

    return render;
  };
};

export class RenderManager implements ChildAppRenderManager {
  private readonly preloadManager: ChildAppPreloadManager;
  private readonly diManager: ChildAppDiManager;
  private readonly resolveFullConfig: typeof CHILD_APP_RESOLVE_CONFIG_TOKEN;
  private readonly log: ReturnType<typeof LOGGER_TOKEN>;
  private readonly hasRenderedSet = new Set<string>();
  private readonly loadingInProgress = new Map<string, ChildAppFinalConfig>();
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

  getChildDi(request: ChildAppRequestConfig): [Container | null, null | Promise<Container | null>] {
    const config = this.resolveFullConfig(request);

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
    const promises: Promise<void>[] = [];

    for (const [_, request] of this.loadingInProgress.entries()) {
      promises.push(this.preloadManager.preload(request));
    }

    this.loadingInProgress.clear();

    if (promises.length) {
      await Promise.all(promises);

      return true;
    }

    return false;
  }

  clear() {
    const preloadedList = this.preloadManager.getPreloadedList();

    for (const request of preloadedList) {
      const config = this.resolveFullConfig(request);

      if (!this.hasRenderedSet.has(config.key)) {
        this.log.warn({
          message: 'Child-app has been preloaded but not used in React render',
          request,
        });
      }
    }

    this.hasRenderedSet.clear();
  }
}
