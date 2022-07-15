import type { EXTEND_RENDER } from '@tramvai/tokens-render';
import type { ChildAppRenderManager } from '@tramvai/tokens-child-app';
import type { ExtractTokenType } from '@tinkoff/dippy';
import { RenderContext } from './react/render-context';

export const extendRender = ({
  renderManager,
}: {
  renderManager: ChildAppRenderManager;
}): ExtractTokenType<typeof EXTEND_RENDER> => {
  return (render) => {
    return <RenderContext.Provider value={renderManager}>{render}</RenderContext.Provider>;
  };
};
