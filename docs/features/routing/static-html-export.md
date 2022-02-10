---
id: static-html-export
title: Static HTML Export
sidebar_position: 3
---

`tramvai` can export pages of your application at build time to HTML files.

## Explanation

`tramvai static <appName>` command run production build of the application,
then starts application server, and make requests to all application routes.
All responses are saved to `.html` files inside `dist/static` directory.

This feature is suitable for applications where all pages are independent of dynamic server-side data.
You can serve exported HTML files without `tramvai` server by CDN or any static server.

## Usage

### Development

1. Run command to export HTML pages with `--serve` flag:

    ```bash
    tramvai static <appName> --serve
    ```

1. Open server with exported pages at http://localhost:3000/

### Production

1. Run command to export HTML pages:

    ```bash
    tramvai static <appName>
    ```

1. Deploy HTML pages to your server and static assets to your CDN

### Static Assets

All static resources (js, css files) will be loaded according to the url specified in `ASSETS_PREFIX` env variable.

## Limitations

Dynamic pages (routes like `/foo/bar/:id`) is not supported, `tramvai static` command only show warnings for this pages.
