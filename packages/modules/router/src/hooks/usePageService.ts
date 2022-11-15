import type { ExtractDependencyType } from '@tinkoff/dippy';
import { useRoute } from '@tinkoff/router';
import { useDi } from '@tramvai/react';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';

export const usePageService = (): ExtractDependencyType<typeof PAGE_SERVICE_TOKEN> => {
  useRoute();

  return useDi(PAGE_SERVICE_TOKEN);
};
