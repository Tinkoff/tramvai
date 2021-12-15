import React from 'react';
import type { EXTEND_RENDER } from '@tramvai/tokens-render';
import type { ChildAppRenderManager } from '@tramvai/tokens-child-app';
import { RenderContext } from './react/render-context';

export const extendRender = ({
  renderManager,
}: {
  renderManager: ChildAppRenderManager;
}): typeof EXTEND_RENDER[number] => {
  return (render) => {
    return <RenderContext.Provider value={renderManager}>{render}</RenderContext.Provider>;
  };
};
