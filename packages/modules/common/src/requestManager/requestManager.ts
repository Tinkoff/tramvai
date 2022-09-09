import pathOr from '@tinkoff/utils/object/pathOr';
import type { Url } from '@tinkoff/url';
import { format, parse } from '@tinkoff/url';
import type { REQUEST, REQUEST_MANAGER_TOKEN } from '@tramvai/tokens-common';

type Interface = typeof REQUEST_MANAGER_TOKEN;

export class RequestManager implements Interface {
  private request: typeof REQUEST;

  private url: string;

  private parsedUrl: Url;

  constructor({ request }: { request: typeof REQUEST }) {
    this.request = request || (({} as unknown) as typeof REQUEST);

    if (typeof window === 'undefined') {
      this.url = format({
        protocol: (this.getHeader('x-forwarded-proto') as string) || this.request.protocol,
        host: this.getHost(),
        path: this.request.originalUrl,
      });
    } else {
      this.url = window.location.href;
    }
  }

  getBody() {
    return this.request.body;
  }

  getUrl() {
    return this.url;
  }

  getParsedUrl() {
    if (!this.parsedUrl) {
      this.parsedUrl = parse(this.url);
    }

    return this.parsedUrl;
  }

  getMethod() {
    return this.request.method;
  }

  getHeader(key: string) {
    return this.request.headers[key];
  }

  getHeaders() {
    return this.request.headers;
  }

  getCookie(key: string) {
    return this.request.cookies[key];
  }

  getCookies() {
    return this.request.cookies;
  }

  getClientIp(): string {
    return this.getHeader('x-real-ip') || pathOr(['connection', 'remoteAddress'], '', this.request);
  }

  getHost(): string {
    if (typeof window === 'undefined') {
      return (this.getHeader('x-original-host') || this.getHeader('host')) as string;
    }

    return window.location.host;
  }
}
