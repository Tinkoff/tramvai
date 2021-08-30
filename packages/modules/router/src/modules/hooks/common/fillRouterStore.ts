import type { NavigationSyncHook } from '@tinkoff/router';
import type { CONTEXT_TOKEN } from '@tramvai/tokens-common';
import { setCurrentNavigation } from '../../../stores/RouterStore';

export const fillRouterStore = ({
  context,
}: {
  context: typeof CONTEXT_TOKEN;
}): NavigationSyncHook => {
  return (navigation) => {
    context.dispatch(setCurrentNavigation(navigation));
  };
};
