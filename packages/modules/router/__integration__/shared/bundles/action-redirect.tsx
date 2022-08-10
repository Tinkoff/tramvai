import { createBundle, declareAction } from '@tramvai/core';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';

const redirectAction = declareAction({
  name: 'redirect',
  fn() {
    const { pageService } = this.deps;

    return pageService.navigate({
      url: '/after/action/redirect/',
      replace: true,
      code: pageService.getCurrentUrl()?.pathname.endsWith('/code/') ? 301 : undefined,
    });
  },
  deps: {
    pageService: PAGE_SERVICE_TOKEN,
  },
});

// eslint-disable-next-line import/no-default-export
export default createBundle({
  name: 'action-redirect',
  components: {
    pageDefault: () => 'action page',
  },
  actions: [redirectAction],
});
