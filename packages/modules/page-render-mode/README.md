# @tramvai/module-page-render-mode

Enable different rendering modes for specific pages:

- `ssr`

  SSR mode - provides default `tramvai` behaviour, render full page on server-side.

- `client`

  Client mode - render only fallback for page component, then render full page on browser, after hydration.

  This mode can significally improve server rendering performance, but not recommended for pages with high SEO impact.

  By default, Header and Footer will be rendered as usual.

- `static`

  Static mode - in-memory cache for page HTML markup.

  Response for first request for specific page, without `Cookie` header, will be cached directly, and sended as response to next requests for this page. Otherwise, unpersonalized request for the same page will be triggered at background, and result will be cached.

  5xx responses will not be cached by default, but this behaviour are configurable.

  Any responses from cache will have `X-Tramvai-Static-Page-From-Cache` header.

  Additional metric with name `static_pages_cache_hit` will be added with cache hits counter.

  Response from cache will be sended from `customer_start` command line, and next lines execution will be aborted.

  Cache will be segmented by page path and method, request hostname, device type and browser (modern or default group).

## Installation

You need to install `@tramvai/module-page-render-mode`

```bash npm2yarn
yarn add @tramvai/module-page-render-mode
```

And connect in the project

```tsx
import { createApp } from '@tramvai/core';
import { PageRenderModeModule } from '@tramvai/module-page-render-mode';

createApp({
  name: 'tincoin',
  modules: [PageRenderModeModule],
});
```

## Usage

### Rendering mode

By default, this module connection has no changes, because default rendering mode is `ssr`. You can change this mode for all pages or for specific pages only.

#### Default mode

For global rendering mode changing, use token `TRAMVAI_RENDER_MODE` from `@tramvai/tokens-render`:

```ts
import { TRAMVAI_RENDER_MODE } from '@tramvai/tokens-render';

const provider = {
  provide: TRAMVAI_RENDER_MODE,
  useValue: 'client',
};
```

#### Mode for specifig pages

For specific pages available two options:

- setting mode in route config:

  ```ts
  const routes = [
    {
      name: 'main',
      path: '/',
      config: {
        bundle: 'mainDefault',
        pageComponent: 'pageDefault',
        pageRenderMode: 'client',
      },
    },
  ];
  ```

- setting mode in page component static property:

  ```tsx
  const PageComponent = () => <div>Page</div>;

  PageComponent.renderMode = 'client';

  export default PageComponent;
  ```

### Fallback

Standard behaviour for SPA applications - render some fallback with spinner or page skeleton before application was rendered. You can set default fallback for all pages with `client` render mode, or only for specific pages.

#### Default fallback

For setting default fallback, use token `PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT`:

```tsx
import { PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT } from '@tramvai/module-page-render-mode';

const DefaultFallback = () => <div>Loading...</div>;

const provider = {
  provide: PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT,
  useValue: DefaultFallback,
};
```

#### Fallback for specific pages

For specific pages available few options:

- add fallback to page component static property, use name `pageRenderFallbackDefault`:

  ```tsx
  import { PageComponent } from '@tramvai/react';

  const Page: PageComponent = () => <div>Page</div>;

  const PageFallback = () => <div>Loading...</div>;

  Page.components = {
    pageRenderFallbackDefault: PageFallback,
  };

  export default Page;
  ```

- add default fallback to bundle, use name `pageRenderFallbackDefault`:

  ```tsx
  const DefaultFallback = () => <div>Loading...</div>;

  const mainDefaultBundle = createBundle({
    name: 'mainDefault',
    components: {
      pageRenderFallbackDefault: DefaultFallback,
    },
  });

  export default mainDefaultBundle;
  ```

- and you can add fallback in route config, use key `pageRenderFallbackComponent` with any fallback name you provided in bundle or page component:

  ```ts
  const routes = [
    {
      name: 'main',
      path: '/',
      config: {
        bundle: 'mainDefault',
        pageComponent: 'pageDefault',
        pageRenderFallbackComponent: 'myOwnFallbackComponent',
      },
    },
  ];
  ```

### Static pages

#### Options

- `ttl` parameter spicified page response cache time. Default - `60000` ms.
- `maxSize` parameter spicified maximum cached urls count (can be up to 4 pages per url for different segments). Default - `1000`. For apps with heavy HTML and a lot of urls memory usage can be increased significantly.

```ts
const provider = {
  provide: STATIC_PAGES_OPTIONS_TOKEN,
  useValue: {
    ttl: 60 * 1000,
    maxSize: 1000,
  },
};
```

## How-to

### How to prevent Header and Footer Rendering

By default, Header and Footer will be rendered as usual, because this module provide Page component wrapper. If you want to make less work on server, use token `PAGE_RENDER_WRAPPER_TYPE` with `layout` or `content` value, e.g.:

```ts
const providers = [
  {
    provide: PAGE_RENDER_WRAPPER_TYPE,
    useValue: 'layout',
  },
];
```

With `client` rendering mode, all layout will be rendered in browser.

`PAGE_RENDER_WRAPPER_TYPE` value will be passed to [default layout](references/modules/render.md#basic-layout), where the library [@tinkoff/layout-factory](references/libs/tinkoff-layout.md#wrappers) is used.

### How to clear static page cache

If you want to clear all cache, make POST request to special papi endpoint without body - `/{appName}/private/papi/revalidate/`.

For specific page, just add `path` parameter to request body, e.g. for `/static/` - `{ path: 'static' }`.

### How to disable background requests for static pages

For example, you want to cache only requests without cookies, without extra requests into the application:

```ts
const provider = {
  provide: STATIC_PAGES_BACKGROUND_FETCH_ENABLED,
  useValue: () => false,
};
```

### How to enable 5xx requests caching for static pages

For example, 5xx responses are expected behaviour:

```ts
const provider = {
  provide: STATIC_PAGES_CACHE_5xx_RESPONSE,
  useValue: () => true,
};
```

## Troubleshooting

### Fallback name conflicts

You might have a potential issue with conflict existing components and render fallback component names - `pageRenderFallbackComponent` and `pageRenderFallbackDefault`. For avoiding this issues, just change fallback name prefix using token `PAGE_RENDER_FALLBACK_COMPONENT_PREFIX`:

```ts
import { PAGE_RENDER_FALLBACK_COMPONENT_PREFIX } from '@tramvai/module-page-render-mode';

const provider = {
  provide: PAGE_RENDER_FALLBACK_COMPONENT_PREFIX,
  useValue: 'myOwnRenderFallback',
};
```
