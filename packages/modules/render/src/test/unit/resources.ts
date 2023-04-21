import flatten from '@tinkoff/utils/array/flatten';
import { getDiWrapper, parseHtml } from '@tramvai/test-helpers';
import { provide } from '@tramvai/core';
import type { PageResource } from '@tramvai/tokens-render';
import { HTML_ATTRS, RENDER_SLOTS, RESOURCES_REGISTRY } from '@tramvai/tokens-render';
import { buildPage } from '@tinkoff/htmlpagebuilder';
import { ResourcesRegistry } from '../../resourcesRegistry';
import { RESOURCE_INLINER } from '../../resourcesInliner';
import { mapResourcesToSlots } from '../../server/PageBuilder';
import { htmlPageSchemaFactory } from '../../server/htmlPageSchema';

type Options = Parameters<typeof getDiWrapper>[0];

export const testPageResources = (options: Options) => {
  const { modules, providers = [] } = options;
  const { di, runLine } = getDiWrapper({
    di: options.di,
    modules,
    providers: [
      {
        provide: 'htmlPageSchema',
        useFactory: htmlPageSchemaFactory,
        deps: {
          htmlAttrs: HTML_ATTRS,
        },
      },
      {
        provide: HTML_ATTRS,
        useValue: {
          target: 'html',
          attrs: {
            class: 'no-js',
            lang: 'ru',
          },
        },
        multi: true,
      },
      ...providers,
      provide({
        provide: RESOURCES_REGISTRY,
        useClass: ResourcesRegistry,
        deps: {
          resourceInliner: RESOURCE_INLINER,
        },
      }),
      provide({
        provide: RESOURCE_INLINER,
        useValue: {
          shouldInline() {
            return false;
          },
          shouldAddResource() {
            return true;
          },
          inlineResource() {
            return [];
          },
          async prefetchResource() {},
        },
      }),
    ],
  });
  const renderSlots = flatten(
    (di.get({ token: RENDER_SLOTS, optional: true }) as Array<PageResource>) ?? []
  );
  const resourcesRegistry = di.get(RESOURCES_REGISTRY);

  const render = () => {
    const rawHtml = buildPage({
      slotHandlers: mapResourcesToSlots([...renderSlots, ...resourcesRegistry.getPageResources()]),
      description: di.get<any>('htmlPageSchema'),
    });

    return parseHtml(rawHtml, {});
  };

  return {
    render,
    di,
    runLine,
  };
};
