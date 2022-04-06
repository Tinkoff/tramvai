---
id: client-side-rendering
title: Client-side rendering
---

## Introduction

Tramvai doesn't have full client-side rendering mode, but has limited ability to render page content only in browser.
In this mode, all requests to application server will be handled as usual, but instead of real pages content rendering, we can render only light-weight fallback (spinner, skeleton, etc.) on server.
After page loading in browser, full page will be rendered.
It is very useful to reduce the load on the application server.

## Get started

:::caution

Before using a feature, make sure you use `SpaRouterModule`!
With `NoSpaRouterModule` you will have a cyclic redirect.

:::

:hourglass: Install `@tramvai/module-page-render-mode` module:

```bash npm2yarn
npm install @tramvai/module-page-render-mode
```

:hourglass: Сonnect module in the project:

```tsx
import { createApp } from '@tramvai/core';
import { PageRenderModeModule } from '@tramvai/module-page-render-mode';

createApp({
  name: 'tincoin',
  modules: [ PageRenderModeModule ],
});
```

[@tramvai/module-page-render-mode documentation](references/modules/page-render-mode.md)

After that, we need to provide default fallback.
In this guide, it fill be empty white page.

:hourglass: Provide fallback page:

```tsx
import React from 'react';
import { createApp } from '@tramvai/core';
import {
  PageRenderModeModule,
  // highlight-next-line
  PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,
} from '@tramvai/module-page-render-mode';

// highlight-next-line
const Fallback = () => null;

createApp({
  name: 'tincoin',
  modules: [ PageRenderModeModule ],
  providers: [
    // highlight-start
    {
      provide: PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,
      useValue: Fallback,
    },
    // highlight-end
  ],
});
```

:hourglass: Prevent Header and Footer rendering:

```tsx
import React from 'react';
import { createApp } from '@tramvai/core';
import {
  PageRenderModeModule,
  PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,
  // highlight-next-line
  PAGE_RENDER_WRAPPER_TYPE,
} from '@tramvai/module-page-render-mode';

const Fallback = () => null;

createApp({
  name: 'tincoin',
  modules: [ PageRenderModeModule ],
  providers: [
    {
      provide: PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,
      useValue: Fallback,
    },
    // highlight-start
    {
      provide: PAGE_RENDER_WRAPPER_TYPE,
      useValue: 'layout',
    },
    // highlight-end
  ],
});
```

After that, you can run `client` rendering mode for concrete pages, or for all of it.
In this guide, we will enable `client` mode for all pages.

:hourglass: Enable `client` mode:

```tsx
import React from 'react';
import { createApp } from '@tramvai/core';
  // highlight-next-line
import { TRAMVAI_RENDER_MODE } from '@tramvai/tokens-render';
import {
  PageRenderModeModule,
  PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,
  PAGE_RENDER_WRAPPER_TYPE,
} from '@tramvai/module-page-render-mode';

const Fallback = () => null;

createApp({
  name: 'tincoin',
  modules: [ PageRenderModeModule ],
  providers: [
    {
      provide: PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,
      useValue: Fallback,
    },
    {
      provide: PAGE_RENDER_WRAPPER_TYPE,
      useValue: 'layout',
    },
    // highlight-start
    {
      provide: TRAMVAI_RENDER_MODE,
      useValue: 'client',
    },
    // highlight-end
  ],
});
```

After that, all requests to application will return white page, and original content will be rendered after main scripts will be loaded, parsed and executed.

## Deep dive

For achieve maximum server performance, we can cache our page fallback, and distribute it from the cdn or balancer.
This will completely free up the application server.

:::caution

When caching a fallback, your users potentially can have a outdated content.
Also, you will have the same meta tags for all application pages, it can affect SEO.

:::

In client-side rendering mode, you can generate static HTML from every page, but we recommended to create special static route for this.
It will allow you to change meta tags information.
Example below use [file-system pages feature](features/routing/file-system-pages.md#file-system-pages).

:hourglass: At first, create empty fallback page:

```tsx title="pages/FallbackPage.tsx"
import React from 'react';

export const FallbackPage = () => {
  return null;
};

export default FallbackPage;
```

:hourglass: And add new static route with this page to application:

```ts
const routes = [
  {
    name: 'fallback',
    path: '/__secret_fallback__/',
    config: {
      pageComponent: '@/pages/FallbackPage',
      meta: {
        seo: {
          metaTags: {
            title: 'Some common title',
          },
        }
      }
    },
  },
]
```

:hourglass: Then build your application as usual:

```bash
tramvai build {{ appName }}
```

:hourglass: In the end, generate static HTML only for one page (if we use default fallback for all pages, page url doesn't matter):

```bash
tramvai static {{ appName }} --buildType=none --onlyPages=/__secret_fallback__/
```

After this steps, you can find a file `dist/static/__secret_fallback__/index.html`.
You can serve this file from CDN or balancer, and it will be working as usual SPA.
