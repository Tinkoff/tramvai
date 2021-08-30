import type { COOKIE_MANAGER_TOKEN } from '@tramvai/module-cookie';

export const createMockCookieManager = (
  entries: Record<string, string> = {}
): typeof COOKIE_MANAGER_TOKEN => {
  const cookies = { ...entries };

  return {
    get(name: string) {
      return cookies[name];
    },
    set({ name, value }) {
      cookies[name] = value;
    },
    all() {
      return cookies;
    },
    remove(name: string) {
      delete cookies[name];
    },
  };
};
