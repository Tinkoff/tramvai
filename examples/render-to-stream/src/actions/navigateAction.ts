import { declareAction } from '@tramvai/core';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';

export const navigateAction = declareAction({
  name: 'navigate-action',
  fn(url: string) {
    // Используем pageService для перехода между страницами
    return this.deps.pageService.navigate({ url });
  },
  // deps позволяет использовать любую зависимость из DI в экшенах
  deps: {
    pageService: PAGE_SERVICE_TOKEN,
  },
});
