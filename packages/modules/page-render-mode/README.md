# @tramvai/module-page-render-mode

Enable different rendering modes for specific pages:

- `ssr`

  SSR mode - provides default `tramvai` behaviour, render full page on server-side.

- `client`

  Client mode - render only fallback for page component, then render full page on browser, after hydration.
  This mode can significally improve server rendering performance, but not recommended for pages with high SEO impact.
  Header and Footer will be rendered as usual.

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
  modules: [ PageRenderModeModule ],
});
```

## Usage

### Rendering mode

By default, this module connection has no changes, because default rendering mode is `ssr`.
You can change this mode for all pages or for specific pages only.

#### Default mode

For global rendering mode changing, use token `PAGE_RENDER_DEFAULT_MODE`:

```ts
import { PAGE_RENDER_DEFAULT_MODE } from '@tramvai/module-page-render-mode';

const provider = {
  provide: PAGE_RENDER_DEFAULT_MODE,
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
  ]
  ```

- setting mode in page component static property:

  ```tsx
  const PageComponent = () => <div>Page</div>;

  PageComponent.renderMode = 'client';

  export default PageComponent;
  ```

### Fallback

Standard behaviour for SPA applications - render some fallback with spinner or page skeleton before application was rendered.
You can set default fallback for all pages with `client` render mode, or only for specific pages.

#### Default fallback

For setting default fallback, use token `PAGE_RENDER_DEFAULT_MODE`:

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
  const PageComponent = () => <div>Page</div>;

  const PageFallback = () => <div>Loading...</div>;

  PageComponent.components = {
    'pageRenderFallbackDefault': PageFallback,
  };

  export default PageComponent;
  ```

- add default fallback to bundle, use name `pageRenderFallbackDefault`:

  ```tsx
  const DefaultFallback = () => <div>Loading...</div>;

  const mainDefaultBundle = createBundle({
    name: 'mainDefault',
    components: {
      'pageRenderFallbackDefault': DefaultFallback,
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
  ]
  ```

## Troubleshooting

### Fallback name conflicts

You might have a potential issue with conflict existing components and render fallback component names - `pageRenderFallbackComponent` and `pageRenderFallbackDefault`.
For avoiding this issues, just change fallback name prefix using token `PAGE_RENDER_FALLBACK_COMPONENT_PREFIX`:

```ts
import { PAGE_RENDER_FALLBACK_COMPONENT_PREFIX } from '@tramvai/module-page-render-mode';

const provider = {
  provide: PAGE_RENDER_FALLBACK_COMPONENT_PREFIX,
  useValue: 'myOwnRenderFallback',
};
```
