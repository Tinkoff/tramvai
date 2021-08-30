import { createToken } from '@tinkoff/dippy';
import type { ApiService, HttpClient } from '@tramvai/http-client';
import type { TinkoffRequestOptions } from '@tramvai/tinkoff-request-http-client-adapter';

export type HttpClientFactoryOptions = TinkoffRequestOptions & { name: string };

/**
 * @description
 * Фабрика HTTP клиентов с минимальными базовыми настройками
 */
export const HTTP_CLIENT_FACTORY = createToken<(options: HttpClientFactoryOptions) => HttpClient>(
  'HTTP_CLIENT_FACTORY'
);

/**
 * @description
 * Универсальный HTTP клиент для произвольных запросов
 */
export const HTTP_CLIENT = createToken<HttpClient>('HTTP_CLIENT');

/**
 * @description
 * Список headers, которые проксируются из запроса в приложение во все запросы в API
 */
export const API_CLIENT_PASS_HEADERS = createToken<string[]>('apiClientPassHeaders', {
  multi: true,
});

/**
 * @description
 * Работа с внутренним апи текущего сервера.
 * Использует значение `APP_INFO_TOKEN` из di для определения адреса для запросов
 */
export const PAPI_SERVICE = createToken<ApiService>('papi service');
