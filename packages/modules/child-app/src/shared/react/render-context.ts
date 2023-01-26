import { createContext } from 'react';
import type { ChildAppRenderManager } from '@tramvai/tokens-child-app';

export const RenderContext = createContext<ChildAppRenderManager | null>(null);
