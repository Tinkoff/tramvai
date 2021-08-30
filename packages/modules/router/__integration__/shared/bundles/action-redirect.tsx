import { createBundle, createAction } from '@tramvai/core';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';

const redirectAction = createAction({
  name: 'redirect',
  fn: (context, payload, { pageService }) => {
    return pageService.navigate({
      url: '/after/action/redirect/',
      replace: true,
      code: pageService.getCurrentUrl().pathname.endsWith('/code/') ? 301 : undefined,
    });
  },
  deps: {
    pageService: PAGE_SERVICE_TOKEN,
  },
});

export default createBundle({
  name: 'action-redirect',
  components: {
    pageDefault: () => 'action page',
  },
  actions: [redirectAction],
});
