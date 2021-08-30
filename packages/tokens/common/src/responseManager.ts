import { createToken } from '@tinkoff/dippy';
import type { Response } from 'express';

/**
 * @description
 * Прямая ссылка на объект ответа
 */
export const RESPONSE = createToken<Response>('response');

/**
 * @description
 * Сущность для работы с инстансами ответа (заголовки ответа, куки, тело ответа).
 * В основном используется только на сервере, но на клиенте есть обрезанный функционал, для упрощения реализации изоморфного приложения
 */
export const RESPONSE_MANAGER_TOKEN = createToken<ResponseManager>('responseManager');

export interface ResponseManager {
  getBody(): string;

  setBody(value: string): void;

  getHeader(key: string): string | string[];

  getHeaders(): Record<string, string | string[]>;

  setHeader(key: string, value: string): void;

  getCookie(key: string): string;

  getCookies(): Record<string, string>;

  setCookie(key: string, value: string): void;

  getStatus(): number;

  setStatus(status: number): void;
}
