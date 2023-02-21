---
id: ssg
title: Static-Site Generation
---

`tramvai` can generate pages of your application at build time to static HTML files, this feature is usually called [Static Site Generation (SSG)](https://www.patterns.dev/posts/static-rendering/)

## Explanation

`tramvai static <appName>` command run production build of the application, then starts application server, and make requests to all application routes. All responses are saved to `.html` files inside `dist/static` directory.

This feature is suitable for applications where all pages are independent of dynamic server-side data. You can serve generated HTML files without `tramvai` server by CDN or any static server.

## Usage

### Development

1. Run development build as usual:

    ```bash
    tramvai start <appName>
    ```

1. Open server with exported pages at http://localhost:3000/

### Production build

1. Run SSG command:

    ```bash
    tramvai static <appName>
    ```

1. Deploy HTML pages to your server and static assets to your CDN

### Preview pages

1. Run SSG command with `--serve` flag:

    ```bash
    tramvai static <appName> --serve
    ```

1. Open server with exported pages at http://localhost:3000/

### Static Assets

All static resources (js, css files) will be loaded according to the url specified in `ASSETS_PREFIX` env variable.

If you build HTML pages with static prefix, for example `ASSETS_PREFIX=https://your.cdn.com/`, this variable injecting in HTML in build time, and you can't change `ASSETS_PREFIX` in deploy time.

## Limitations

Dynamic pages (routes like `/foo/bar/:id`) is not supported, `tramvai static` command only show warnings for this pages. For now you can use only `query` parameters for this case.

Server-side [Application Lifecycle](03-features/06-app-lifecycle.md) and [Navigation Flow](03-features/07-routing/02-navigation-flow.md#server-navigation) will be executed only once at build time. It means than some data will be non-existed, empty or outdated, for example `User-Agent` will not be parsed.
