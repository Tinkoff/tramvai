import { createApp, createBundle, declareAction, provide } from '@tramvai/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SeoModule, META_WALK_TOKEN } from '@tramvai/module-seo';
import { ROUTES_TOKEN } from '@tramvai/tokens-router';
import { RESOURCE_INLINE_OPTIONS, ResourceType } from '@tramvai/tokens-render';
import { modules, bundles } from '../../../../test/shared/common';
import { jsonLd } from './data/jsonLd';

const metaSpecial = (context, meta) => {
  meta.updateMeta(10, {
    metaCustom: {
      tag: 'meta',
      attributes: {
        name: 'metaCustomNameAttribute',
        content: 'metaCustomContent',
      },
    },
  });
};

const dynamicAction = declareAction({
  name: 'dynamicMeta',
  async fn() {
    await new Promise((res) => setTimeout(res, 200));

    this.deps.meta.updateMeta(20, {
      title: 'WoW, such dynamic!',
    });
  },
  deps: {
    meta: META_WALK_TOKEN,
  },
  conditions: {
    always: true,
  },
});

const dynamicBundle = createBundle({
  name: 'dynamic',
  components: {
    page: () => 'dynamic page',
    layout: ({ children }) => children,
  },
  actions: [dynamicAction],
});

createApp({
  name: 'seo',
  modules: [...modules, SeoModule.forRoot([metaSpecial] as any)],
  bundles: {
    ...bundles,
    dynamic: () => Promise.resolve({ default: dynamicBundle }),
  },
  providers: [
    {
      provide: ROUTES_TOKEN,
      multi: true,
      useValue: [
        {
          name: 'default',
          path: '/seo/default/',
        },
        {
          name: 'common',
          path: '/seo/common/',
          config: {
            meta: {
              seo: {
                metaTags: {
                  canonical: 'test-canonical',
                  descriptions: 'my test description',
                  keywords: 'test,common,seo',
                  robots: 'none',
                  title: 'common seo',
                  viewport: 'test seo',
                },
              },
            },
          },
        },
        {
          name: 'twitter',
          path: '/seo/twitter/',
          config: {
            meta: {
              seo: {
                metaTags: {
                  title: 'twitter seo',
                },
                shareSchema: {
                  twitterCard: {
                    card: 'twitter card',
                    creator: 'creat',
                    image: 'img tw',
                    imageAlt: 'seo tw im al',
                    site: 'seo @tinkoff_bank',
                    title: 'hello, twitter',
                  },
                },
              },
            },
          },
        },
        {
          name: 'og',
          path: '/seo/og/',
          config: {
            meta: {
              seo: {
                metaTags: {
                  title: 'og seo',
                },
                shareSchema: {
                  openGraph: {
                    description: 'og desc',
                    image: 'og img',
                    imageAlt: 'alt og img',
                    imageSecure: 'seo imageSecure',
                    imageHeight: 'seo 630',
                    imageWidth: 'seo 1200',
                    imageType: 'ggog',
                    locale: 'locog',
                    siteName: 'site og name',
                    title: 'hello, og',
                    type: 'og typ',
                    url: 'http://og.og/',
                  },
                },
              },
            },
          },
        },
        {
          name: 'json-ld',
          path: '/seo/json-ld/',
          config: {
            meta: {
              seo: {
                metaTags: {
                  title: 'json-ld seo',
                },
                structuredData: {
                  jsonLd,
                },
              },
            },
          },
        },
        {
          name: 'seo-dynamic',
          path: '/seo/dynamic/',
          config: {
            bundle: 'dynamic',
            pageComponent: 'page',
            layoutComponent: 'layout',
          },
        },
      ].map((route) => ({
        ...route,
        config: {
          bundle: 'root',
          pageComponent: 'page',
          layoutComponent: 'layout',
          ...route.config,
        },
      })),
    },
  ],
});
