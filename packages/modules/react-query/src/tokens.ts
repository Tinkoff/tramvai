import { createToken } from '@tinkoff/dippy';
import type { QueryClient, DefaultOptions } from 'react-query';
import type { DehydratedState } from 'react-query/hydration';

/**
 * @description
 * [Клиент react-query](https://react-query.tanstack.com/reference/QueryClient)
 */

export const QUERY_CLIENT_TOKEN = createToken<QueryClient>('reactQuery queryClient');

/**
 * @description
 * [Дефолтные опции для клиента react-query](https://react-query.tanstack.com/guides/important-defaults)
 */
export const QUERY_CLIENT_DEFAULT_OPTIONS_TOKEN = createToken<DefaultOptions>(
  'reactQuery queryClientDefaultOptions'
);

/**
 * @description
 * [Стейт для клиента react-query](https://react-query.tanstack.com/reference/hydration/dehydrate), иницилизированный на сервере
 */
export const QUERY_CLIENT_DEHYDRATED_STATE_TOKEN = createToken<DehydratedState>(
  'reactQuery queryClientDehydratedState'
);

export const QUERY_DEHYDRATE_STATE_NAME_TOKEN = createToken<string>(
  'reactQuery dehydrate state name'
);
