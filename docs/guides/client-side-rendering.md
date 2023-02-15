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

Some important features will not work:
- User-Agent parsing - User-Agent or Client-Hints parsed only at server side, so you will need to realize it on client side if you need it
- Media detection - always will came wrong from server (with SSR only first load will be without real data), so will be useless for optimizations

:::

For one client-side rendering fallback, which will work on every application route, we need a few things:
- Fallback component with some preloader or skeleton (`PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT`)
- Special route for this page (for example, `/__csr_fallback__/`)
- Build application (server and client code) as usual
- Generate static HTML page for `/__csr_fallback__/` route

All of this are included when using `tramvai static` command with `TRAMVAI_FORCE_CLIENT_SIDE_RENDERING=true` env variable, when `@tramvai/module-page-render-mode` are connected in the application. Only one step you need for HTML fallback generation:

```bash
TRAMVAI_FORCE_CLIENT_SIDE_RENDERING=true tramvai static {{ appName }}
```

:::tip

How `tramvai static` works?

This command basically runs the compiled `server.js` and makes a HTTP request to the specified URLs, every response will be saved as an HTML file.

:::

After this steps, you can find a file `dist/static/__csr_fallback__/index.html`.
You can deploy this file with other assets to S3 file storage and serve this file from CDN or balancer, and it will be working as usual SPA.

### Environment variables

In `tramvai` application we can separate a two types of env variables:

- build-time env
- deployment env

When using the command `TRAMVAI_FORCE_CLIENT_SIDE_RENDERING=true tramvai static {{ appName }}`, you need to pass both build-time and deployment env for CI job when you will run `tramvai static`, because of real application server will be launched for this command, and real requests for API's will be sended.

Env variable `TRAMVAI_FORCE_CLIENT_SIDE_RENDERING` will be available in `ENV_MANAGER_TOKEN`, you can use it for some custom logic about CSR.

### Testing

For fallback development, you can use start command with CSR flag - `TRAMVAI_FORCE_CLIENT_SIDE_RENDERING=true tramvai start {{ appName }}` - and open special route `http://localhost:3000/__csr_fallback__/` in browser.

For testing fallback close to production, you can use `http-server` library, and this scripts:
- `TRAMVAI_FORCE_CLIENT_SIDE_RENDERING=true ASSETS_PREFIX=http://localhost:4444/ tramvai static {{ appName }}` for build and fallback generation
- `npx http-server dist/static/__csr_fallback__ --proxy http://localhost:8080\\? --cors` for serving fallback HTML at 8080 port
- `npx http-server dist/client -p 4444 --cors` for serving assets at 4444 port

### Known errors

#### Infinite reload

It is expected error, when you try to open fallback page directly or open non-existent route, and it will be reloaded infinitely.

When you open a fallback page, it will try to navigate to the current url, and if current url is not registered in app router, not found default logic will be triggered, which will force **hard reload** under the hood. It is useful when another applications is served from the same domain, you have some shared menu with relative links, and you can't navigate to them with SPA-transition.

You can add [Not Found](03-features/07-routing/06-wildcard-routes.md#not-found-page) route for application, and it will be rendered instead of infinite reload. But you will be unable to navigate to other applications through relative links.

If you want to test production version of fallback locally - use `http-server` as described above in [Testing](#testing) section. For real production environment, you need to configure your own balancer to serve fallback page for all routes.
