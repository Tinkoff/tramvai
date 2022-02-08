import type { HttpClientBaseOptions } from '@tramvai/http-client';
import compose from '@tinkoff/utils/function/compose';

/**
 * Опции `modifyRequest`, `modifyResponse` и `modifyError`, при наличии в обоих аргументах,
 * объединяются через метод `compose`, сначала выполняется метод из первого аргумента, затем из второго.
 */
// eslint-disable-next-line complexity
export function mergeOptions(
  options: HttpClientBaseOptions,
  nextOptions: HttpClientBaseOptions,
  config?: { replace?: boolean }
): HttpClientBaseOptions {
  if (config?.replace) {
    return {
      ...options,
      ...nextOptions,
    };
  }
  const result: HttpClientBaseOptions = {
    ...options,
    ...nextOptions,
    query: {
      ...options.query,
      ...nextOptions.query,
    },
    headers: {
      ...options.headers,
      ...nextOptions.headers,
    },
  };

  const composeModifier = (modifier: 'modifyRequest' | 'modifyResponse' | 'modifyError') => {
    if (options[modifier] && nextOptions[modifier]) {
      // eslint-disable-next-line no-param-reassign
      result[modifier] = compose(nextOptions[modifier]!, options[modifier]!);
    }
  };

  composeModifier('modifyRequest');
  composeModifier('modifyResponse');
  composeModifier('modifyError');

  return result;
}
