---
id: csr
title: Client-Side Rendering
---

Full [Client-Side Rendering (CSR)](https://www.patterns.dev/posts/client-side-rendering/) is **not supported** by `tramvai` framework.

For high load applications with static or closed by authorization pages, there is some good options to use, for example [client rendering mode](#client-mode) - limited ability to render page content only in browser, which can improve page rendering speed in 3-4 times.

In this mode, all requests to application server will be handled as usual, but instead of real pages content rendering, we can render only light-weight fallback (spinner, skeleton, etc.) on server. After page loading in browser, full page will be rendered. It is very useful to reduce the load on the application server.

Another way it [Static Site Generation](03-features/010-rendering/04-ssg.md), you always can generate empty pages with skeletons, and made all data requests client-side.


For ultimate application resilience under heavy loads, we can use a perfect pattern - [client-side rendering fallback](#csr-fallback).

## CSR fallback

Inspired by this article - [Scaling React Server-Side Rendering](https://arkwright.github.io/scaling-react-server-side-rendering.html#client-side-rendering-fallback).

We can use [SSG](03-features/010-rendering/04-ssg.md) for generation only one fallback page and distribute it from the CDN. Then, balancer can switch all application traffic for this fallback HTML, for example if application send `429` response code (default [tramvai request-limiter](references/modules/request-limiter.md) behaviour). This can completely free up the application server.

:::caution

When caching a fallback, your users potentially can have a outdated content.
Also, you will have the same meta tags for all application pages, it can affect SEO.

Some important features will not work:
- User-Agent parsing - User-Agent or Client-Hints parsed only at server side, so you will need to implement it on client side if you need it
- Media detection - always will came wrong from server (with SSR only first load will be without real data), so will be useless for optimizations
- On page initialization, router flow will be different - `beforeResolve` hook will be triggered at `customerStart` line
- On [redirects](03-features/07-routing/07-redirects.md) while page initialization, global actions and `resolveUserDeps` with `resolvePageDeps` lines will be triggered twice, one for current route and one for redirect route

:::

For one client-side rendering fallback, which will work on every application route, we need a few things:
- Fallback component with some preloader or skeleton (`PAGE_RENDER_DEFAULT_FALLBACK_COMPONENT`)
- Special route for this page (for example, `/__csr_fallback__/`)
- Build application (server and client code) as usual
- Generate static HTML page for `/__csr_fallback__/` route

All of this are included when using `tramvai static` command with `TRAMVAI_FORCE_CLIENT_SIDE_RENDERING=true` env variable, when `@tramvai/module-page-render-mode` are [connected in the application](03-features/010-rendering/02-page-render-mode.md#installation). You need only one step for HTML fallback generation:

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

When using the command `TRAMVAI_FORCE_CLIENT_SIDE_RENDERING=true tramvai static {{ appName }}`, you need to pass both build-time and deployment env for CI job when you run `tramvai static`, because the real application server will be launched for this command, and real requests for API's will be sended.

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