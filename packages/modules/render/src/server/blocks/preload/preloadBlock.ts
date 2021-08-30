import each from '@tinkoff/utils/array/each';
import path from '@tinkoff/utils/object/path';
import type { PageResource } from '@tramvai/tokens-render';
import { ResourceSlot, ResourceType } from '@tramvai/tokens-render';
import { PRELOAD_JS } from '../../constants/performance';
import { onload } from './onload.inline';

export const addPreloadForCriticalJS = (pageResources: PageResource[]): PageResource => {
  const jsUrls: string[] = [];

  each((res) => {
    if (res.type === 'script' && path(['attrs', 'data-critical'], res)) {
      jsUrls.push(res.payload);
    }
  }, pageResources);

  return {
    type: ResourceType.inlineScript,
    slot: ResourceSlot.HEAD_PERFORMANCE,
    payload: `window.${PRELOAD_JS}=(${onload})([${jsUrls.map((url) => `"${url}"`).join(',')}])`,
  };
};
