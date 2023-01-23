# RenderModule

Module for rendering React application on the server and in the browser

## Overview

![init command](/img/render/render-module.drawio.svg)

Module contains the logic for generating HTML pages, starting from getting current page component, and finishing with the rendering result HTML using the `@tinkoff/htmlpagebuilder` library.

This module includes code for creating top-level React component with all necessary providers composition, and page and layout components from the current route.

## Installation

You need to install `@tramvai/module-render`

```bash npm2yarn
npm install @tramvai/module-render
```

And connect to the project

```tsx
import { createApp } from '@tramvai/core';
import { RenderModule } from '@tramvai/module-render';

createApp({
  name: 'tincoin',
  modules: [RenderModule],
});
```

## Explanation

### React Strict Mode

More information about Strict Mode can be found in the [official documentation](https://reactjs.org/docs/strict-mode.html).

To set the mode, you must pass the `useStrictMode` parameter when initializing the `RenderModule`.

```typescript
RenderModule.forRoot({ useStrictMode: true });
```

### Application static assets

For static assets (JS, CSS, fonts, etc.) we create special resources registry module, which allow to provide in DI list of resources, and then render them to specifics slots in final HTML.

Example:

```typescript
createApp({
  providers: [
    {
      provide: RENDER_SLOTS,
      multi: true,
      useValue: [
        {
          type: ResourceType.inlineScript, // inlineScript wrap payload in tag <script>
          slot: ResourceSlot.HEAD_CORE_SCRIPTS, // define position where in HTML will be included resource
          payload: 'alert("render")',
        },
        {
          type: ResourceType.asIs, // asIs just add payload as a string, without special processing
          slot: ResourceSlot.BODY_TAIL,
          payload: '<div>hello from render slots</div>',
        },
      ],
    },
  ],
});
```

- **type** - presets for different resources types
- **slot** - slot in HTML where resource will be included
- **payload** - information that will be rendered

<p>
<details>
<summary>Available slots</summary>

@inline src/server/constants/slots.ts

</details>
</p>

<p>
<details>
<summary>Layout of slots in the HTML page</summary>

@inline src/server/htmlPageSchema.ts

</details>
</p>

[How to add assets loading to a page](#How-to-add-assets-loading-to-a-page)

### Automatic resource inlining

#### Concept

A large number of resource files creates problems when loading the page, because the browser has to create a lot of connections to small files

#### Solution

To optimize page loading, we've added the ability to include some resources directly in the incoming HTML from the server.
To avoid inlining everything at all, we've added the ability to set an upper limit for file size.

#### Connection and configuration

Since version `0.60.7` inlining for styles is enabled by default, CSS files smaller than 40kb before gzip (+-10kb after gzip) are inlined.
To override these settings, add a provider specifying types of resources to be inlined (styles and/or scripts) and an upper limit for file size (in bytes, before gzip):

```js
import { RESOURCE_INLINE_OPTIONS } from '@tramvai/tokens-render';
import { ResourceType } from '@tramvai/tokens-render';
import { provide } from '@tramvai/core';

provide({
  provide: RESOURCE_INLINE_OPTIONS,
  useValue: {
    types: [ResourceType.script, ResourceType.style], // Turn on for a CSS and JS files
    threshold: 1024, // 1kb unzipped
  },
}),
```

#### Peculiarities

All scripts and styles (depending on the settings) registered through the `ResourcesRegistry` are inlined.

File uploading to the server occurs in lazy mode, asynchronously.
This means that there will be no inlining when the page first loads.
It also means that there is no extra waiting for resources to load on the server side.
Once the file is in the cache it will be inline.
The cache has a TTL of 30 minutes and there is no resetting of the cache.

### Automatic resource preloading

To speed up data loading, we've added a preloading system for resources and asynchronous chunks, which works according to the following scenario:

- After rendering the application, we get information about all the CSS, JS bundles and asynchronous chunks used in the application
- Next we add all the CSS to the **preload** tag and add onload event on them. We need to load the blocking resources as quickly as possible.
- When loading any CSS file, onload event will be fired (only once time) and add all **preload** tags to the necessary JS files

### Layouts

[Actual documentation](03-features/04-layouts.md)

## How to

### How to add assets loading to a page

There are 2 main ways how you can add resources to your application

- The `RENDER_SLOTS` token, where you can pass a list of resources, such as HTML markup, inline scripts, script tag
- Token `RESOURCES_REGISTRY` to get the resource manager, and register the desired resources manually

Example:

<p>
<details>
<summary>Application example</summary>

@inline ../../../examples/how-to/render-add-resources/index.tsx

</details>
</p>

### React 18 concurrent features

`tramvai` will automatically detect React version, and use hydrateRoot API on the client for 18+ version.

Before switch to React 18, we recommended to activate [Strict Mode](https://reactjs.org/docs/strict-mode.html) in your application.
In Strict Mode which React warns about using the legacy API.

To connect, you must configure the `RenderModule`:

```js
modules: [
  RenderModule.forRoot({ useStrictMode: true })
]
```
### Testing

#### Testing render extensions via RENDER_SLOTS or RESOURCES_REGISTRY tokens

If you have a module or providers that define `RENDER_SLOTS` or use `RESOURCES_REGISTRY`, it is convenient to use special utilities to test them separately

```ts
import {
  RENDER_SLOTS,
  ResourceSlot,
  RESOURCES_REGISTRY,
  ResourceType,
} from '@tramvai/tokens-render';
import { testPageResources } from '@tramvai/module-render/tests';
import { CustomModule } from './module';
import { providers } from './providers';

describe('testPageResources', () => {
  it('modules', async () => {
    const { render } = testPageResources({
      modules: [CustomModule],
    });
    const { head } = render();

    expect(head).toMatchInlineSnapshot(`
"
<meta charset=\\"UTF-8\\">
<script>console.log(\\"from module!\\")</script>
"
`);
  });

  it('providers', async () => {
    const { render, runLine } = testPageResources({
      providers,
    });

    expect(render().body).toMatchInlineSnapshot(`
"
"
  `);

    await runLine(commandLineListTokens.resolvePageDeps);

    expect(render().body).toMatchInlineSnapshot(`
"
<script defer=\\"defer\\" charset=\\"utf-8\\" crossorigin=\\"anonymous\\" src=\\"https://scripts.org/script.js\\"></script>
<span>I\`m body!!!</span>
"
  `);
  });
});
```

## Exported tokens

[link](references/tokens/render.md)
