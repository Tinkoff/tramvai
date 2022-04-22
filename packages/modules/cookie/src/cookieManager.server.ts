import type { REQUEST_MANAGER_TOKEN, RESPONSE_MANAGER_TOKEN } from '@tramvai/tokens-common';
import { serialize } from 'cookie';
import type { USER_AGENT_TOKEN } from '@tramvai/module-client-hints';
import { prepareCookieOptions } from './utils';
import type { CookieManager as Interface, CookieOptions, CookieSetOptions } from './tokens';

export class CookieManager implements Interface {
  private cookies: Record<string, string>;

  private requestManager: typeof REQUEST_MANAGER_TOKEN;

  private responseManager: typeof RESPONSE_MANAGER_TOKEN;

  private userAgent: typeof USER_AGENT_TOKEN;

  constructor({
    requestManager,
    responseManager,
    userAgent,
  }: {
    requestManager: typeof REQUEST_MANAGER_TOKEN;
    responseManager: typeof RESPONSE_MANAGER_TOKEN;
    userAgent: typeof USER_AGENT_TOKEN;
  }) {
    this.requestManager = requestManager;
    this.responseManager = responseManager;
    this.userAgent = userAgent;
    this.cookies = { ...requestManager.getCookies() };
  }

  get(name) {
    return this.cookies[name];
  }

  set({ name, value, ...options }: CookieSetOptions) {
    this.responseManager.setCookie(
      name,
      serialize(
        name,
        value,
        prepareCookieOptions(
          {
            userAgent: this.userAgent,
            defaultHost: this.requestManager.getHost(),
            secureProtocol: this.requestManager.getUrl().startsWith('https:'),
          },
          { path: '/', ...options }
        )
      )
    );
    // Записываем в cookie request, так как эти данные могут дальше читаться и использоваться
    this.cookies[name] = value;
  }

  all() {
    return this.cookies;
  }

  remove(name: string, options?: CookieOptions) {
    this.set({ ...options, name, value: '', expires: new Date(0) });
    delete this.cookies[name];
  }
}
