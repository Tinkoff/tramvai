# Client Hints

Modules provides various parameters from the client device, e.g. type of the device, screen size, etc.

## Installation

First, install `@tramvai/module-client-hints`

```bash npm2yarn
npm i --save @tramvai/module-client-hints
```

Then add `ClientHintsModule` to the modules list

```tsx
import { createApp } from '@tramvai/core';
import { ClientHintsModule } from '@tramvai/module-client-hints';

createApp({
  modules: [ClientHintsModule],
});
```

## Explanation

### User agent details parsing

Parsing is implemented with library [@tinkoff/user-agent](../libs/user-agent.md) that may use either user-agent header or client-hints headers.

If there is a `sec-ch-ua` header in request than user agent parsing will be based on [Client Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Client_hints) headers. If there is no such header than old school parsing of user-agent string will be used.

This logic implies next things worth to mention:
- by default, only part of client-hints is sent by browser and you can get only partial info about user browser (no cpu spec, platform version or device model). Although, we send an additional header `accept-ch` with response from server to request this data from client - on first request from current browser there will be no such data in any case and they will appear only on subsequent requests
- if you need to use additional info, you may specify the header [`accept-ch`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) in your app with `REQUEST_MANAGER_TOKEN`
- client-hints is mostly more performant way to parse browser info and this is way it used if it's possible
- currently only chromium based browsers support client hints, so for other browsers and bots user-agent header will be used to gather browser info

### The problem with media on server and on client

One of the SSR problem is render of the component which depends of current screen size, e.g. image carousel that should render specific number of images depending of screen width. By default, the exact screen size can be figured out only on client-side and we can't render such content on server identical to the client render. If this content is not important for the SEO we can use skeletons and spinners, but they are not suitable for every case.

Client Hints modules provides the way to solve this problem in some way. It stores data about client devices in cookies and then use this cookies on server in next page loading.

### How does media work

#### First page loading

:::warning

When user enters the app for the first time, information about **real** device screen size and type **not available** in server-side code.

:::

This module tries to determine type of the user device using user-agent string, and separates the devices into three groups:
- `mobile`
- `tablet`
- `desktop`

Then it saves this **assumptive** information about device screen to `media` store. E.g. when user loads page from the desktop, then content of the `media` store will be following:

```tsx
const state = {
  // desktop - 1024px, tablet - 600px, mobile - 300px
  width: 1024,
  // desktop - 768px, tablet - 800px, mobile - 500px
  height: 768,
  // desktop - false, tablet - true, mobile - true
  isTouch: false,
  retina: false,
  supposed: true,
  synchronized: false,
};
```

On the client focusing on value `supposed: true` module resolves **real** info about client device, updates `media` store and calls the rerender for the dependent components. E.g. for the widescreen monitor the data of `media` store might be next:

```tsx
const state = {
  width: 1920,
  height: 1080,
  isTouch: false,
  retina: true,
  supposed: false,
  synchronized: false,
};
```

While we have value `synchronized: false` **it is not allowed** to use data from the `media` store for on the server-side as data is not synchronized with the client and it will lead to page jumps when saving real data about device.

#### Next page loads

When user loads the app next time the data about user device will be read from cookies and value `synchronized` will be set to true. This way on server and on client we will get the same content of the `media` store and no page rerenders on the client:

```tsx
const state = {
  width: 1920,
  height: 1080,
  isTouch: false,
  retina: true,
  supposed: false,
  synchronized: true,
};
```

#### Use ClientHints in component

If some component if depend of screen size:

1. When user loads app for the first time **is not possible** to guarantee the same exact render on server and client
2. On first app load you may show some skeleton to the user by checking `supposed: true` property
3. You can guarantee the same exact render on server and client only in case `synchronized: true`

## Api

### Stores

#### userAgent

Stores the result of the user-agent string or client-hints headers parsing.

#### media

Stores the media information about type and size of the client screen.

### media helpers

`media` store has next data:

```tsx
type Media = {
  width: number;
  height: number;
  isTouch: boolean;
  retina: boolean;
  supposed?: boolean;
  synchronized?: boolean;
};
```

`fromClientHints(media: Media): boolean` - returns true if media data is synchronized on client and server

`isSupposed(media: Media): boolean` - returns true if media data are determined on server by the user-agent string and will be changes on the client

`isRetina(media: Media): boolean` - returns true if pixel density is equal to 2 or higher

`useMedia(): Media` - returns current state of the `media` store

`useFromClientHints(): boolean` - calculates fromClientHints

`useIsSupposed(): boolean` - calculates isSupposed

`useIsRetina(): boolean` - calculates isRetina

## How to

### Render skeleton only when user loads pages first time

```tsx
const App = () => {
  const isSupposed = useIsSupposed();

  if (isSupposed) {
    return <AdaptiveSliderSkeleton />;
  }

  return <AdaptiveSlider />;
};
```

### Render adaptive component on first time and on subsequent loads render specific component

```tsx
const App = () => {
  const media = useMedia();
  const fromClientHints = useFromClientHints();

  let Block = AdaptiveBlock;

  if (fromClientHints) {
    Block = media.width >= 1024 ? DesktopBlock : MobileBlock;
  }

  return <Block />;
};
```

## Exported tokens

### USER_AGENT_TOKEN

Object as a result of parsing user-agent string with [@tinkoff/user-agent](../libs/user-agent.md). Parsing happens only on server-side and parsed info is reused on client-side.
