import type { Url } from '@tinkoff/url';
import { format, parse } from '@tinkoff/url';
import type { REQUEST_MANAGER_TOKEN } from '@tramvai/tokens-common';
import type { FASTIFY_REQUEST } from '@tramvai/tokens-server-private';

type Interface = typeof REQUEST_MANAGER_TOKEN;

export class RequestManager implements Interface {
  private request: typeof FASTIFY_REQUEST;

  private url: string;

  private parsedUrl!: Url;

  constructor({ request }: { request: typeof FASTIFY_REQUEST }) {
    this.request = request || ({} as unknown as typeof FASTIFY_REQUEST);

    if (typeof window === 'undefined') {
      this.url = format({
        protocol: (this.getHeader('x-forwarded-proto') as string) || this.request.protocol,
        host: this.getHost(),
        path: this.request.url,
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
    return this.request.headers?.[key];
  }

  getHeaders(): Record<string, string | string[] | undefined> {
    return this.request.headers;
  }

  getCookie(key: string) {
    return this.request.cookies[key];
  }

  getCookies() {
    return this.request.cookies;
  }

  getClientIp(): string {
    return (this.getHeader('x-real-ip') as string) || this.request?.socket?.remoteAddress || '';
  }

  getHost(): string {
    if (typeof window === 'undefined') {
      return (this.getHeader('x-original-host') || this.getHeader('host')) as string;
    }

    return window.location.host;
  }
}
