import './typings';

import { declareModule } from '@tramvai/core';
import { ForceCSRModule } from './ForceCSRModule';
import { sharedProviders } from './shared';
import { staticPagesProviders } from './staticPages';

export * from './tokens';

// @todo: перенести в @tramvai/module-render
export const PageRenderModeModule = declareModule({
  name: 'PageRenderModeModule',
  imports: [ForceCSRModule],
  providers: [...sharedProviders, ...staticPagesProviders],
});
