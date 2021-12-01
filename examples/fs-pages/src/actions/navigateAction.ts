import { createAction } from '@tramvai/core';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';

export const navigateAction = createAction({
  name: 'navigate-action',
  fn: (
    context,
    url: string,
    { pageService }: { pageService: typeof PAGE_SERVICE_TOKEN }
  ) => {
    // Используем pageService для перехода между страницами
    return pageService.navigate({ url });
  },
  // deps позволяет использовать любую зависимость из DI в экшенах
  deps: {
    pageService: PAGE_SERVICE_TOKEN,
  },
});
