import { ActionCondition } from '@tramvai/module-common';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';

export const condition = ({
  pageService,
}: {
  pageService: typeof PAGE_SERVICE_TOKEN;
}): ActionCondition => {
  return {
    key: 'custom',
    fn: (checker) => {
      if (checker.conditions.custom) {
        const { pathname } = pageService.getCurrentUrl();
        console.log(pathname);
        if (pathname !== '/custom/') {
          checker.forbid();
        }
      }
    },
  };
};
