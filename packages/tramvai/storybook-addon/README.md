# @tramvai/storybook-addon

Storybook addon for tramvai apps

## Installation

You need to install `@tramvai/storybook-addon`:

```bash npm2yarn
npm install @tramvai/storybook-addon
```

And connect addon in the storybook configuration file:

```js title=".storybook/main.js"
module.exports = {
  addons: ["@tramvai/storybook-addon"]
}
```

## Features

- Providers for DI container
- Providers for router
- Providers for `react-query`
- Page actions support
- tramvai `babel` configuration
- tramvai `postcss` configuration

## How to

### Access to DI container

<Tabs>
  <TabItem value="page" label="page.tsx" default>

```tsx
import { LOGGER_TOKEN } from '@tramvai/tokens-common';

export const Page = () => {
  const logger = useDi(LOGGER_TOKEN);

  logger.info('render');

  return (
    <h1>Page</h1>
  );
}
```

  </TabItem>
  <TabItem value="story" label="page.stories.tsx" default>

```tsx
import type { TramvaiStoriesParameters } from '@tramvai/storybook-addon';
import { Page } from './page';

// You can pass to DI container any reducers, providers and modules
const parameters: TramvaiStoriesParameters = {
  tramvai: {
    stores: [],
    initialState: {},
    providers: [],
    modules: [],
  },
};

export default {
  title: 'Page',
  component: Page,
  parameters,
};

export const PageStory = () => <Page />;
```

  </TabItem>
</Tabs>

### Router hooks and components

<Tabs>
  <TabItem value="page" label="page.tsx" default>

```tsx
import { Link, useUrl } from '@tramvai/module-router';

export const Page = () => {
  const url = useUrl();

  return (
    <>
      <h1>Page at {url.pathname}</h1>
      <p>
        <Link url="/third/">to third page</Link>
      </p>
    </>
  );
}
```

  </TabItem>
  <TabItem value="story" label="page.stories.tsx" default>

```tsx
import type { TramvaiStoriesParameters } from '@tramvai/storybook-addon';
import { Page } from './page';

// You can pass to router current route and url
const parameters: TramvaiStoriesParameters = {
  tramvai: {
    currentRoute: { name: 'second', path: '/second/' },
  },
};

export default {
  title: 'Page',
  component: Page,
  parameters,
};

export const PageStory = () => <Page />;
```

  </TabItem>
</Tabs>

### React Query

<Tabs>
  <TabItem value="page" label="page.tsx" default>

```tsx
import { createQuery, useQuery } from '@tramvai/react-query';


const query = createQuery({
  key: 'base',
  fn: async () => {
    return { foo: 'bar' };
  },
});

export const Page = () => {
  const { data, isLoading } = useQuery(query);

  return (
    <>
      <h1>Page</h1>
      <p>
        {isLoading ? 'Loading...' : data.foo}
      </p>
    </>
  );
}
```

  </TabItem>
  <TabItem value="story" label="page.stories.tsx" default>

```tsx
import type { TramvaiStoriesParameters } from '@tramvai/storybook-addon';
import { Page } from './page';

// You can pass to router QueryClient default options
const parameters: TramvaiStoriesParameters = {
  tramvai: {
    reactQueryDefaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  },
};

export default {
  title: 'Page',
  component: Page,
  parameters,
};

export const PageStory = () => <Page />;
```

  </TabItem>
</Tabs>

### Page actions running

<Tabs>
  <TabItem value="page" label="page.tsx" default>

```tsx
import { declareAction } from '@tramvai/core';

const serverAction = declareAction({
  name: 'server-action',
  fn() {
    console.log('server action');
  },
  conditions: {
    onlyServer: true,
  },
});

const browserAction = declareAction({
  name: 'browser-action',
  fn() {
    console.log('browser action');
  },
  conditions: {
    onlyBrowser: true,
  },
});

export const Page = () => {
  return (
    <h1>Page</h1>
  );
}

Page.actions = [serverAction, browserAction];
```

  </TabItem>
  <TabItem value="story" label="page.stories.tsx" default>

```tsx
import type { TramvaiStoriesParameters } from '@tramvai/storybook-addon';
import { Page } from './page';

// Actions with `onlyBrowser` condition will be executed
const parameters: TramvaiStoriesParameters = {
  tramvai: {
    actions: Page.actions,
  },
};

export default {
  title: 'Page',
  component: Page,
  parameters,
};

export const PageStory = () => <Page />;
```

  </TabItem>
</Tabs>

### Http clients with real requests

<Tabs>
  <TabItem value="page" label="page.tsx" default>

```tsx
import { declareAction } from '@tramvai/core';

const httpRequestAction = declareAction({
  name: 'http-request-action',
  async fn() {
    return this.deps.httpClient.get('/');
  },
  deps: {
    httpClient: HTTP_CLIENT,
  },
});

export const Page = () => {
  return (
    <h1>Page</h1>
  );
}

Page.actions = [httpRequestAction];
```

  </TabItem>
  <TabItem value="story" label="page.stories.tsx" default>

```tsx
import { HttpClientModule } from '@tramvai/module-http-client';
import type { TramvaiStoriesParameters } from '@tramvai/storybook-addon';
import { Page } from './page';

// HttpClientModule is required for real requests
const parameters: TramvaiStoriesParameters = {
  tramvai: {
    actions: Page.actions,
    modules: [HttpClientModule],
  },
};

export default {
  title: 'Page',
  component: Page,
  parameters,
};

export const PageStory = () => <Page />;
```

  </TabItem>
</Tabs>

### How to provide environment variables?

This addon provides a few important defaults:

- Mock provider for `ENV_MANAGER_TOKEN`
- Read `env.development.js` content from application root

So, any variables from `env.development.js` will be registered in `envManager`.

If you want to add custom variables for some stories, pass `options` for `CommonTestModule` (from `@tramvai/test-mocks` package) in story parameters:

```ts
const parameters: TramvaiStoriesParameters = {
  tramvai: {
    options: {
      env: {
        FOO: 'BAR',
      },
    },
  },
};
```

## Contribute

For testing changes in this plugin locally, you need a few steps:

1. [tramvai repo] Copy `examples-standalone/storybook` application to different folder, e.g. `storybook-app`
1. [storybook-app] Update there all `tramvai` dependencies in `package.json`
1. [tramvai repo] Copy plugin build output from `packages/tramvai/storybook-addon/lib`
1. [storybook-app] Paste into the `storybook-app/node_modules/@tramvai/storybook-addon/lib` folder
1. [storybook-app] Run `storybook` in nested folder `cd storybook && npm run storybook`
