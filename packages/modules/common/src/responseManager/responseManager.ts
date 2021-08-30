import isEmpty from '@tinkoff/utils/is/empty';
import values from '@tinkoff/utils/object/values';
import type { RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';

type Interface = typeof RESPONSE_MANAGER_TOKEN;

export class ResponseManager implements Interface {
  private body: string;

  private headers: Record<string, string>;

  private cookies: Record<string, string>;

  private status: number;

  constructor() {
    this.body = '';
    this.headers = {};
    this.cookies = {};
    this.status = 200;
  }

  getBody() {
    return this.body;
  }

  setBody(value: string) {
    this.body = value;
  }

  getHeader(key: string) {
    if (key === 'set-cookie') {
      return values(this.cookies);
    }

    return this.headers[key];
  }

  getHeaders() {
    if (isEmpty(this.cookies)) {
      return this.headers;
    }

    return {
      ...this.headers,
      'Set-Cookie': values(this.cookies),
    };
  }

  setHeader(key: string, value: string) {
    this.headers[key] = value;
  }

  getCookie(key: string) {
    return this.cookies[key];
  }

  getCookies() {
    return this.cookies;
  }

  setCookie(key: string, value: string) {
    this.cookies[key] = value;
  }

  setStatus(status: number) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }
}
