---
id: ssr
title: Server-Side Rendering
---

[Server-side rendering (SSR)](https://www.patterns.dev/posts/server-side-rendering/) - is default `tramvai` rendering mode, which means that for every user request framework will generate HTML page in runtime, and this page content may be completely dynamic and all data will be fresh.

Also it means that all `tramvai` application code needs to be **universal** (or isomorphic) - ready to run both on the server and the client.

You can find complete request lifecycle at [Application Lifecycle](03-features/06-app-lifecycle.md#request-flow) documentation, and how routing works in [Navigation Flow](03-features/07-routing/02-navigation-flow.md#server-navigation) page.

SSR has a lot of advantages:
- Always up-to-date content
- SEO support
- Fast [First Contentful Paint (LCP)](https://web.dev/i18n/en/fcp/)
- Easy to get great [Largest Contentful Paint (LCP)](https://web.dev/i18n/en/lcp/) and [Cumulative Layout Shift (CLS)](https://web.dev/i18n/en/cls/) metrics
- Consistently good API requests timings on the server-side
- Minimal client network requests waterfall because all required page resources (JS, CSS) will already have been added to HTML

SSR also brings some challenges:
- Slow [Time to First Byte (TTFB)](https://web.dev/i18n/en/ttfb/) (`tramvai` doesn't support [Streaming Rendering](03-features/010-rendering/06-streaming.md) which can improve this metric)
- More complex infrastructure (monitoring, logging, deployment, scaling)
- High server load when generating HTML

To be able to better handle high loads, `tramvai` provides a few additional page render modes, which allow the server to do less work when generating HTML - [static](03-features/010-rendering/02-page-render-mode.md#static-mode) and [client](03-features/010-rendering/02-page-render-mode.md#client-mode) modes. Also, [lazy hydration](03-features/010-rendering/03-hydration.md) is available to improve client-side loading performance.

##### - [Next: Page Render Mode](03-features/010-rendering/02-page-render-mode.md)
