import { provide } from '@tramvai/core';
import { PWA_SW_SCOPE_TOKEN, PWA_SW_URL_TOKEN } from '../tokens';

export const providers = [
  provide({
    provide: PWA_SW_URL_TOKEN,
    useFactory: () => {
      const swDest = process.env.TRAMVAI_PWA_SW_DEST as string;
      const finalUrl = swDest.startsWith('/') ? swDest : `/${swDest}`;

      // @todo check that finalUrl is relative and ends with .js

      return finalUrl;
    },
  }),
  provide({
    provide: PWA_SW_SCOPE_TOKEN,
    useFactory: () => {
      const swScope = process.env.TRAMVAI_PWA_SW_SCOPE as string;

      // @todo validate

      return swScope;
    },
  }),
];
