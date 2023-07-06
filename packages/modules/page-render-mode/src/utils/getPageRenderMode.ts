import type { ExtractDependencyType } from '@tinkoff/dippy';
import type { TramvaiRenderMode } from '@tramvai/tokens-render';
import type { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import type { PageComponent } from '@tramvai/react';
import type { PAGE_RENDER_DEFAULT_MODE } from '../tokens';

export const getPageRenderMode = ({
  pageService,
  defaultRenderMode,
}: {
  pageService: ExtractDependencyType<typeof PAGE_SERVICE_TOKEN>;
  defaultRenderMode: ExtractDependencyType<typeof PAGE_RENDER_DEFAULT_MODE>;
}): TramvaiRenderMode => {
  const { pageComponent, pageRenderMode } = pageService.getConfig();
  const { renderMode } = (pageService.getComponent(pageComponent) as PageComponent) ?? {};
  const mode = pageRenderMode || renderMode || defaultRenderMode;

  return typeof mode === 'function' ? mode() : mode;
};
