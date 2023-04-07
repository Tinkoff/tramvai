/* eslint-disable sort-class-members/sort-class-members */
import flatten from '@tinkoff/utils/array/flatten';
import type { CONTEXT_TOKEN, LOGGER_TOKEN } from '@tramvai/module-common';
import type { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import { buildPage } from '@tinkoff/htmlpagebuilder';
import type {
  HTML_ATTRS,
  POLYFILL_CONDITION,
  RENDER_SLOTS,
  RESOURCES_REGISTRY,
  RENDER_FLOW_AFTER_TOKEN,
  FETCH_WEBPACK_STATS_TOKEN,
} from '@tramvai/tokens-render';
import { ResourceSlot, ResourceType } from '@tramvai/tokens-render';
import { safeStringify } from '@tramvai/safe-strings';
import { ChunkExtractor } from '@loadable/server';
import type { ExtractDependencyType } from '@tinkoff/dippy';
import { bundleResource } from './blocks/bundleResource/bundleResource';
import { polyfillResources } from './blocks/polyfill';
import { addPreloadForCriticalJS } from './blocks/preload/preloadBlock';
import type { ReactRenderServer } from './ReactRenderServer';
import { formatAttributes } from './utils';

type NarrowToArray<T> = T extends any[] ? T : T[];

export const mapResourcesToSlots = (resources) =>
  resources.reduce((acc, resource) => {
    const { slot } = resource;

    if (Array.isArray(acc[slot])) {
      acc[slot].push(resource);
    } else {
      acc[slot] = [resource];
    }
    return acc;
  }, {});

export class PageBuilder {
  private resourcesRegistry: typeof RESOURCES_REGISTRY;

  private pageService: typeof PAGE_SERVICE_TOKEN;

  // eslint-disable-next-line react/static-property-placement
  private context: typeof CONTEXT_TOKEN;

  private htmlPageSchema: any;

  private reactRender: ReactRenderServer;

  private htmlAttrs: Array<typeof HTML_ATTRS>;

  private polyfillCondition: typeof POLYFILL_CONDITION;

  private modern: boolean;

  private renderFlowAfter: ExtractDependencyType<typeof RENDER_FLOW_AFTER_TOKEN>;

  private log: ReturnType<ExtractDependencyType<typeof LOGGER_TOKEN>>;

  private fetchWebpackStats: typeof FETCH_WEBPACK_STATS_TOKEN;

  constructor({
    renderSlots,
    pageService,
    resourcesRegistry,
    context,
    reactRender,
    htmlPageSchema,
    polyfillCondition,
    htmlAttrs,
    modern,
    renderFlowAfter,
    logger,
    fetchWebpackStats,
  }) {
    this.htmlAttrs = htmlAttrs;
    this.renderSlots = flatten(renderSlots || []);
    this.pageService = pageService;
    this.context = context;
    this.resourcesRegistry = resourcesRegistry;
    this.reactRender = reactRender;
    this.htmlPageSchema = htmlPageSchema;
    this.polyfillCondition = polyfillCondition;
    this.modern = modern;
    this.renderFlowAfter = renderFlowAfter || [];
    this.log = logger('page-builder');
    this.fetchWebpackStats = fetchWebpackStats;
  }

  async flow(): Promise<string> {
    const stats = await this.fetchWebpackStats({ modern: this.modern });
    const extractor = new ChunkExtractor({ stats, entrypoints: [] });

    // first we render the application, because we need to extract information about the data used by the components
    await this.renderApp(extractor);

    // load information and dependency for the current bundle and page
    await this.fetchChunksInfo(extractor);

    await Promise.all(
      this.renderFlowAfter.map((callback) =>
        callback().catch((error) => {
          this.log.warn({ event: 'render-flow-after-error', callback, error });
        })
      )
    );

    this.dehydrateState();

    this.preloadBlock();

    return this.generateHtml();
  }

  dehydrateState() {
    this.resourcesRegistry.register({
      type: ResourceType.asIs,
      slot: ResourceSlot.BODY_END,
      // String much better than big object, source https://v8.dev/blog/cost-of-javascript-2019#json
      payload: `<script id="__TRAMVAI_STATE__" type="application/json">${safeStringify(
        this.context.dehydrate().dispatcher
      )}</script>`,
    });
  }

  async fetchChunksInfo(extractor: ChunkExtractor) {
    const { modern } = this;
    const { bundle, pageComponent } = this.pageService.getConfig();

    this.resourcesRegistry.register(
      await bundleResource({
        bundle,
        modern,
        extractor,
        pageComponent,
        fetchWebpackStats: this.fetchWebpackStats,
      })
    );
    this.resourcesRegistry.register(
      await polyfillResources({
        condition: this.polyfillCondition,
        modern,
        fetchWebpackStats: this.fetchWebpackStats,
      })
    );
  }

  preloadBlock() {
    const preloadResources = addPreloadForCriticalJS(this.resourcesRegistry.getPageResources());

    this.resourcesRegistry.register(preloadResources);
  }

  generateHtml() {
    const resultSlotHandlers = mapResourcesToSlots([
      ...this.renderSlots,
      ...this.resourcesRegistry.getPageResources(),
    ]);

    return buildPage({
      slotHandlers: resultSlotHandlers,
      description: this.htmlPageSchema,
    });
  }

  private renderSlots: NarrowToArray<typeof RENDER_SLOTS>;

  async renderApp(extractor: ChunkExtractor) {
    const html = await this.reactRender.render(extractor);

    this.renderSlots = this.renderSlots.concat({
      type: ResourceType.asIs,
      slot: ResourceSlot.REACT_RENDER,
      payload: `<div ${formatAttributes(this.htmlAttrs, 'app')}>${html}</div>`,
    });
  }
}
/* eslint-enable sort-class-members/sort-class-members */
