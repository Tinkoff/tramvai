import flatten from '@tinkoff/utils/array/flatten';
import type { Provider } from '@tramvai/core';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import { CONTEXT_TOKEN } from '@tramvai/module-common';
import { MetaWalk } from '@tinkoff/meta-tags-generate';
import { metaDefaultPack, defaultPack } from './metaDefaultPack';
import { META_PRIORITY_ROUTE } from './constants';
import { META_DEFAULT_TOKEN, META_WALK_TOKEN, META_UPDATER_TOKEN } from './tokens';

const capitalize = (str) => {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
};

const convertWithPrefix = (key, record = {}) => {
  const result = {};

  Object.keys(record).forEach((item) => {
    result[key + capitalize(item)] = record[item];
  });

  return result;
};

export const sharedProviders: Provider[] = [
  {
    provide: META_WALK_TOKEN,
    useClass: MetaWalk,
  },
  // дефолтный пак metaList
  {
    provide: META_DEFAULT_TOKEN,
    useValue: defaultPack,
  },
  {
    provide: META_UPDATER_TOKEN,
    multi: true,
    useFactory: ({ defaultMeta }) => metaDefaultPack(defaultMeta),
    deps: {
      defaultMeta: META_DEFAULT_TOKEN,
    },
  },
  {
    // получение из админки мета тегов
    provide: META_UPDATER_TOKEN,
    useFactory: ({ pageService }) => {
      return (walker) => {
        const seo = pageService.getMeta().seo || {};
        const shareSchema = seo.shareSchema || {};
        const metaTags = {
          ...seo.metaTags, // Базовые теги
          ...convertWithPrefix('twitter', shareSchema.twitterCard), // преобразование тегов с twitterCard
          ...convertWithPrefix('og', shareSchema.openGraph), // преобразование тегов с opengraph
        };

        walker.updateMeta(META_PRIORITY_ROUTE, metaTags);
      };
    },
    multi: true,
    deps: {
      pageService: PAGE_SERVICE_TOKEN,
    },
  },
  {
    // преобразовыет логику старого токена metaList к новому META_UPDATER_TOKEN
    // TODO: убрать, легаси
    provide: META_UPDATER_TOKEN,
    multi: true,
    useFactory: ({ context, metaList }) => {
      const list = flatten<Function>(metaList || []);

      return (walker) => {
        list.forEach((fn) => fn(context, walker));
      };
    },
    deps: {
      context: CONTEXT_TOKEN,
      metaList: { token: 'metaList', optional: true },
    },
  },
];
