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

  if (nextOptions.modifyRequest || options.modifyRequest) {
    result.modifyRequest =
      options.modifyRequest && nextOptions.modifyRequest
        ? compose(nextOptions.modifyRequest, options.modifyRequest)
        : nextOptions.modifyRequest || options.modifyRequest;
  }
  if (nextOptions.modifyResponse || options.modifyResponse) {
    result.modifyResponse =
      options.modifyResponse && nextOptions.modifyResponse
        ? compose(nextOptions.modifyResponse, options.modifyResponse)
        : nextOptions.modifyResponse || options.modifyResponse;
  }
  if (nextOptions.modifyError || options.modifyError) {
    result.modifyError =
      options.modifyError && nextOptions.modifyError
        ? compose(nextOptions.modifyError, options.modifyError)
        : nextOptions.modifyError || options.modifyError;
  }
  return result;
}
