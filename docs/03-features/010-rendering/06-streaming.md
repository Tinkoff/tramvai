---
id: streaming
title: Streaming Rendering
---

Full [Streaming Rendering](https://www.patterns.dev/posts/ssr/) is **not supported** by `tramvai` framework.

Streaming can significantly improve TTFB metric, but have a lot of disadvantages:
- Require completely different framework architecture
- Performance overhead for Streams (10-20% slower rendering time)
- After first byte is sended, impossible to make server redirect or change response headers

For better new [React 18 Suspense SSR features](https://beta.reactjs.org/reference/react-dom/server/renderToString#when-a-component-suspends-the-html-always-contains-a-fallback) support, you can switch from [renderToString](https://beta.reactjs.org/reference/react-dom/server/renderToString) to [renderToPipeableStream](https://beta.reactjs.org/reference/react-dom/server/renderToPipeableStream) API, with token `REACT_SERVER_RENDER_MODE`.

But with `renderToPipeableStream` `tramvai` will still buffer HTML before send it to client in one chunk. The main difference that we will waiting for Suspended components and render it at server-side. With `renderToString` opposite, we will render fallbacks only. 

## How to use `renderToPipeableStream`

:::caution

Don't forget about performance penalty, `renderToPipeableStream` is slower than `renderToString` by 10-20%.

:::

```ts
import { REACT_SERVER_RENDER_MODE } from '@tramvai/tokens-render';

const provider = provide({
  provide: REACT_SERVER_RENDER_MODE,
  useValue: 'streaming',
});
```
