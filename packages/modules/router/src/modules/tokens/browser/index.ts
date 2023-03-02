import type { Navigation } from '@tinkoff/router';
import { STORE_TOKEN } from '@tramvai/tokens-common';
import { BlockError, makeErrorSilent } from '@tinkoff/errors';
import { setPageErrorEvent } from '../../../stores/PageErrorStore';
import { additionalRouterParameters } from '../../tokens';
import { prefetchProviders } from './prefetch';

export const clientTokens = [
  ...prefetchProviders,
  {
    provide: additionalRouterParameters,
    useFactory: ({ store }) => {
      return {
        onBlock: async (navigation: Navigation) => {
          let error = new BlockError({ message: `Url ${navigation.to?.actualPath} is blocked` });
          error = makeErrorSilent(error);
          store.dispatch(setPageErrorEvent(error));
        },
      };
    },
    deps: {
      store: STORE_TOKEN,
    },
  },
];
