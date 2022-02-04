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

### The problem with media on server and on client

One of the SSR problem is render of the component which depends of current screen size, e.g. image carousel that should render specific number of images depending of screen width. By default, the exact screen size can be figured out only on client-side and we can't render such content on server identical to the client render. If this content is not important for the SEO we can use skeletons and spinners, but they are not suitable for every case.

Client Hints modules provides the way to solve this problem in some way. It stores data about client devices in cookies and then use this cookies on server in next page loading.

### How does it work

#### First page loading

When user enters the app for the first time module tries to determine type of the user device using user-agent string. Then it saves this **assumptive** data to `media` store. E.g. when user loads page from the desktop, then content of the `media` store will be following:

```tsx
const state = {
  width: 1024,
  height: 768,
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

Stores the result of the user-agent string parsing.

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
