# Browser-timings

Lib for measure client browsers performance. Automatically collects performance data on page load.

## Installation

Install npm package

```bash
npm i --save @tinkoff/browser-timings
```

## How to

```ts
import { browserTimings } from '@tinkoff/browser-timings';

window.addEventListener('load', () => {
  setTimeout(() => {
    // setTimeout is necessary in order to get metrics about loadEventEnd
    const perfData = browserTimings();
  }, 0);
});
```

After executing `perfData` will contain client performance metrics which may be send to any external system for further analysis.

> Call of the library should be executed only after page load in order to get actual data. Otherwise, it may return empty object without data.

## Lib interface

```tsx
export interface Timings {
  /* Connection timing from client to server */
  connection: number;
  /* How much time backend was preparing response */
  backend: number;
  /* Page download to client */
  pageDownload: number;
  /* Timing of first paint for a page */
  'first-paint': number;
  /* Timing when DOM becomes interactive */
  domInteractive: number;
  /* DOM building is complete */
  domComplete: number;
  /* Page and every resource were loaded */
  pageLoadTime: number;
  /* Common information about resources and its loading time grouped by type */
  download: {
    html: TimingResource;
    js: TimingResource;
    css: TimingResource;
    img: TimingResource;
    font: TimingResource;
    other: TimingResource;
  };
}

interface TimingResource {
  /* Timing of resource loading */
  duration: number;
  /* Byte-size measure of data used by resource */
  encodedDecodeSize: number;
  /* Byte-size measure of data transferred by network. Calculating difference between encodedDecodeSize - transferSize may reveal how much data where stored in browser cache */
  transferSize: number;
}
```
