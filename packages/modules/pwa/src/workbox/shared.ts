import { provide } from '@tramvai/core';
import { PWA_SW_SCOPE_TOKEN, PWA_SW_URL_TOKEN } from '../tokens';

export const providers = [
  provide({
    provide: PWA_SW_SCOPE_TOKEN,
    useFactory: () => {
      const swScope = process.env.TRAMVAI_PWA_SW_SCOPE as string;

      return swScope;
    },
  }),
  provide({
    provide: PWA_SW_URL_TOKEN,
    useFactory: ({ swScope }) => {
      const swDest = process.env.TRAMVAI_PWA_SW_DEST as string;
      const normalizedUrl = swDest.startsWith('/') ? swDest : `/${swDest}`;
      const normalizedScope = swScope.replace(/\/$/, '');
      const finalUrl = `${normalizedScope}${normalizedUrl}`;

      return finalUrl;
    },
    deps: {
      swScope: PWA_SW_SCOPE_TOKEN,
    },
  }),
];
