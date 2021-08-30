import { createToken } from '@tinkoff/dippy';
import type { Request } from 'express';

// Это костыль чтобы обойти инлайнинг Request'а и выставление наружу внутренних зависимостей express'а
type RequestExt = Request;
/**
 * @description
 * Прямая ссылка на объект запроса
 */
export const REQUEST = createToken<RequestExt>('request');

/**
 * @description
 * Сущность для работы с инстансами запроса (заголовки запросов, query-параметры, куки).
 * В основном используется только на сервере, но на клиенте есть обрезанный функционал, для упрощения реализации изоморфного приложения
 */
export const REQUEST_MANAGER_TOKEN = createToken<RequestManager>('requestManager');

export interface RequestManager {
  getBody(): unknown;

  getUrl(): string;

  getMethod(): string;

  getCookie(key: string): string;

  getCookies(): Record<string, string>;

  getHeader(key: string): string | string[];

  getHeaders(): Record<string, string | string[]>;

  getClientIp(): string;

  getHost(): string;
}
