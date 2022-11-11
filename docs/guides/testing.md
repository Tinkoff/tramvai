---
id: testing
title: Testing
---

`tramvai` provides a complete set of utilites for unit and integration testing.

This utilities based on main `tramvai` concepts and features, and built on top of solid testing solutions (any of this dependencies are optional):

- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Puppeteer](https://pptr.dev/)

## Setup environment

This setup will use `jest` as test runner.

:hourglass: Install `jest` dependencies and `ts-node` for TS config support:

```bash npm2yarn
npm install --save-dev jest jest-circus jest-environment-jsdom @types/jest ts-node
```

:hourglass: Install tramvai-specific jest presets (`tramvai add` command considers current `tramvai` version in application):

```bash
tramvai add --dev @tramvai/test-unit-jest
tramvai add --dev @tramvai/test-integration-jest
```

:hourglass: Create `jest.config.ts` as preset for unit tests:

```ts title="jest.config.ts"
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: '@tramvai/test-unit-jest',
  testPathIgnorePatterns: ['node_modules/', '__integration__'],
};

export default config;
```

:hourglass: And `jest.integration.config.ts` for integration tests:

```ts title="jest.integration.config.ts"
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: '@tramvai/test-integration-jest',
  testMatch: ['**/__integration__/**/?(*.)+(test).[jt]s?(x)'],
};

export default config;
```

:hourglass: At last, update `scripts` in `package.json`:

```json title="package.json"
{
  "name": "test-app",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:integration": "jest -w=3 --config ./jest.integration.config.js",
    "test:integration:watch": "jest --runInBand --watch --config ./jest.integration.config.js"
  }
}
```

## Unit tests

The basic building blocks of any `tramvai` application are components, DI providers, reducers and actions.

Unit testing approach is perfectly suited for these blocks.

### Actions

Actions can contain complex logic and interactions with global state and DI providers that can easily be covered by unit tests.
Library `@tramvai/test-unit` export `testAction` API for this purpose, here a simple example:

```ts
import { declareAction } from '@tramvai/core';
import { testAction } from '@tramvai/test-unit';

// simple action, just return some value
export const action = declareAction({
  name: 'test',
  fn() {
    return 'ok';
  },
});

it('test', async () => {
  const { run } = testAction(action);

  // run our action and read result
  const result = await run();

  expect(result).toEqual('ok');
});
```

Even for simple unit tests some of important dependencies need to be mocked or initialized:
- DI container
- Store for reducers

`testAction` provides a default setup for these dependencies and parameters for customizing them.

### Dependency mocks

`@tramvai/test-mocks` library provides a set of mocks for the popular `tramvai` dependencies, including:

- `ENV_MANAGER_TOKEN`
- `LOGGER_TOKEN`
- `APP_INFO_TOKEN`
- `REQUEST_MANAGER_TOKEN`
- `COOKIE_MANAGER_TOKEN`
- `CREATE_CACHE_TOKEN`
- `CONTEXT_TOKEN`

For complex unit tests, you can prevent writing a boilerplate code with `CommonTestModule`, which initializes all mocks and provides them to the DI container:

```ts
import { testAction } from '@tramvai/test-unit';
import { CommonTestModule } from '@tramvai/test-mocks';

const action = declareAction({
  name: 'test',
  async fn() {
    const { logger, envManager } = this.deps;
    const value = envManager.get('ENV_KEY');

    logger.log(value);
  },
  // CommonTestModule provides mocks for this deps
  deps: {
    logger: LOGGER_TOKEN,
    envManager: ENV_MANAGER_TOKEN,
  },
});

it('test', async () => {
  const { run } = testAction(action, {
    modules: [
      // configure `ENV_MANAGER_TOKEN` mock, created by `CommonTestModule`, with `forRoot`
      CommonTestModule.forRoot({ env: { ENV_KEY: 'ENV_VALUE' } })
    ],
  });

  await run();
});
```

#### DI configuration

DI mock is the main opportunity to change the behavior of dependencies in unit tests.
You can pass a custom DI container to utilities, or only list of required modules and providers.
In example below both test suites are equivalent:

```ts
import { testAction } from '@tramvai/test-unit';
import { createMockDi } from '@tramvai/test-mocks';

it('pass custom di', async () => {
  const di = createMockDi({ modules: [], providers: [] });
  const { run } = testAction(action, { di });

  await run();
});

it('pass modules and providers', async () => {
  const { run } = testAction(action, { modules: [], providers: [] });

  await run();
});
```

For example, you want to mock HTTP client for action, so you need to provide `HTTP_CLIENT` mock:

```ts
import { testAction } from '@tramvai/test-unit';
import { declareAction } from '@tramvai/core';
import { HTTP_CLIENT } from '@tramvai/tokens-http-client';

// simple action with request to /foo/bar endpoint
const action = declareAction({
  name: 'test',
  async fn() {
    const { httpClient } = this.deps;

    await httpClient.request('/foo/bar');
  },
  deps: {
    // default HTTP client from @tramvai/module-http-client
    httpClient: HTTP_CLIENT,
  },
});

it('test', async () => {
  const request = jest.fn(async () => ({ payload: null }));

  // create mock for HTTP_CLIENT
  const providers = [{
    provide: HTTP_CLIENT,
    useValue: {
      request,
    },
  }];

  // pass this mock to DI
  const { run } = testAction(action, { providers });

  await run();

  // check than request was called
  expect(request).toHaveBeenCalledWith('/foo/bar');
});
```

:::tip

Better way to test HTTP calls is to mock as little as possible.
For unit tests, prefer to mock `node-fetch` library, and use real HTTP clients implementations.

This kind of mocks requires more setup code, because we need to initialize `tramvai` network layer.
Some modules export specific utilities for simplifying testing process.
For example, `@tramvai/module-http-client` export [testApi](https://tramvai.dev/docs/references/modules/http-client/#testing-your-api-clients) helper.

:::

#### Store configuration

For `tramvai` Store mock you can pass a list of reducers, or initial state object, or both.
Reducers will be registered in Store directly, and if initial state will have the same keys, this values will be applied for the relevant reducers.
For the rest of initial state keys, fake reducers will be created.

Example with passed `stores`:

```ts
import { createReducer } from '@tramvai/state';
import { createMockStore } from '@tramvai/test-mocks';

const reducer = createReducer('test', { value: 'initial' });

const store = createMockStore({ stores: [reducer] });
const state = store.getState();

console.log(state.test); // { value: 'initial' }
```

Example with passed `initialState`:

```ts
import { createMockStore } from '@tramvai/test-mocks';

const initialState = { test: { value: 'initial' } };

const store = createMockStore({ initialState });
const state = store.getState();

console.log(state.test); // { value: 'initial' }
```

Example with store and replaced initial state:

```ts
import { createReducer } from '@tramvai/state';
import { declareAction } from '@tramvai/core';
import { testAction } from '@tramvai/test-unit';

const reducer = createReducer('test', { value: 'initial' });
// the same key as the reducer name
const initialState = { test: { value: 'replaced' } };

const store = createMockStore({ stores: [reducer], initialState });
const state = store.getState();

console.log(state.test); // { value: 'replaced' }
```

And complete example with action testing:

```ts
import { createReducer, createEvent } from '@tramvai/state';
import { declareAction } from '@tramvai/core';

const increment = createEvent('increment');
const reducer = createReducer('counter', 0)
  .on(increment, (state) => state + 1);

const action = declareAction({
  name: 'increment',
  async fn() {
    await this.dispatch(increment());
  },
});

it('test', async () => {
  // no need to use createMockStore directly, just pass store to testAction
  const { run, context } = testAction(action, { stores: [reducer] });

  // context.getState is just alias for store.getState
  expect(context.getState()).toEqual({ counter: 0 });

  await run();

  expect(context.getState()).toEqual({ counter: 1 });
});
```

### Reducers

Every reducers in `tramvai` application is an independent part of the global Store, and also can be covered by unit tests.
Because reducers do not interact directly with DI, we don't need to mock anything.
Library `@tramvai/test-unit` export `testReducer` API for this purpose, where Store will be created automatically, e.g.:

```ts
import { createReducer, createEvent } from '@tramvai/state';
import { testReducer } from '@tramvai/test-unit';

const increment = createEvent('increment');

const reducer = createReducer('counter', 0)
  .on(increment, (state) => state + 1);

it('increment', () => {
  const store = testReducer(reducer);

  expect(store.getState()).toEqual(0);

  store.dispatch(increment());

  expect(store.getState()).toEqual(1);
});
```

### Modules

In general, modules in `tramvai` are just configurable sets of DI providers, united by common features.
Testing a module involves checking its initialization and behavior of the providers added to the application.
Library `@tramvai/test-unit` exports `testModule` API for this purpose, and like `testAction` API, DI container mock will be created automatically, and can be configured or replaced.

:::tip

Integration tests usually is a better way to testing complex modules, because you can test a real application behavior, not only `tramvai` internals.

If the module being tested has a direct impact on the response of the application (HTML markup, redirects, any other side-effect), use `@tramvai/test-integration` library, and additionally `@tramvai/test-puppeteer` to run tests in a real browser.
But if your module only adds some dependencies without side-effects to DI, e.g. API clients, unit testing is a simpliest way to go.

:::

Imagine, you write a `tramvai` module, which provide custom logger for your application:

```ts
import { Module, provide, createToken } from '@tramvai/core';

interface CustomLogger {
  log(message: string): void;
}

const CUSTOM_LOGGER_TOKEN =
  createToken<(name: string) => CustomLogger>('custom logger');

@Module({
  providers: [
    provide({
      provide: CUSTOM_LOGGER_TOKEN,
      useValue: (name: string) => ({
        log: (message: string) => console.log(`[${name}] ${message}`),
      }),
    }),
  ],
})
class CustomLoggerModule {}
```

Simple unit test for `CUSTOM_LOGGER_TOKEN` provider can look like this:

```ts
import { testModule } from '@tramvai/test-unit';

jest.spyOn(global.console, 'log')

it('test', () => {
  const { di } = testModule(CustomLoggerModule);

  const logger = di.get(CUSTOM_LOGGER_TOKEN);

  logger('test').log('hello world');

  expect(console.log).toBeCalledWith('[test] hello world');
});
```

#### Command line runner

For example, we want to add some logic to `commandLineRunner` step, let's create a new module:

```ts
import { Module, provide, commandLineListTokens } from '@tramvai/core';

@Module({
  providers: [
    provide({
      provide: commandLineListTokens.customerStart,
      useValue: () => {
        console.log('customer_start line');
      },
    }),
  ],
})
class TestModule {}
```

`testModule` will return `runLine` method for easy calls of different stages:

```ts
import { testModule } from '@tramvai/test-unit';
import { commandLineListTokens } from '@tramvai/core';

jest.spyOn(global.console, 'log')

it('test', async () => {
  const { runLine } = testModule(TestModule);

  expect(console.log).not.toBeCalled();

  // Run only specific command line in order to execute handlers for this line inside module
  // highlight-next-line
  await runLine(commandLineListTokens.customerStart);

  expect(console.log).toBeCalledWith('customer_start line');
});
```

#### Conjunction with other modules

For example, we want to use logger from `CustomLoggerModule` in our `TestModule`:

```ts
import { Module, provide, commandLineListTokens } from '@tramvai/core';

@Module({
  providers: [
    provide({
      provide: commandLineListTokens.customerStart,
      useFactory: ({ loggerFactory }) => {
        const logger = loggerFactory('test');

        return () => {
          logger.log('customer_start line');
        };
      },
      deps: {
        loggerFactory: CUSTOM_LOGGER_TOKEN,
      },
    }),
  ],
})
class TestModule {}
```

We can pass `CustomLoggerModule` to `modules` property in `testModule` utility:

```ts
import { testModule } from '@tramvai/test-unit';
import { commandLineListTokens } from '@tramvai/core';

jest.spyOn(global.console, 'log')

it('test', async () => {
  const { runLine } = testModule(TestModule, {
    modules: [CustomLoggerModule],
  });

  expect(console.log).not.toBeCalled();

  // highlight-next-line
  await runLine(commandLineListTokens.customerStart);

  expect(console.log).toBeCalledWith('[test] customer_start line');
});
```

### Components

`testComponent` uses [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro) under the hood, initializes `tramvai` mocks and wraps target component in necessary providers.

:::caution

Use jest `jsdom` environment for components unit testing.

:::

Basic unit test example:

```tsx
/**
 * @jest-environment jsdom
 */

import { testComponent, screen } from '@tramvai/test-react';

const Component = ({ id }: { id: string }) => {
  return <div data-testid={id}>Content</div>;
};

it('event', () => {
  // render
  testComponent(<Component id="test" />);

  // assert
  expect(screen.getByTestId('test').textContent).toBe('Content');
});
```

#### Props changing

```tsx
/**
 * @jest-environment jsdom
 */

import { testComponent, screen } from '@tramvai/test-react';

const Component = ({ content }: { content: string }) => {
  return <div data-testid="test">{content}</div>;
};

it('props', () => {
  const { rerender } = testComponent(<Component content="Content" />);

  expect(screen.getByTestId('test').textContent).toBe('Content');

  rerender(<Component content="New content" />);

  expect(screen.getByTestId('test').textContent).toBe('New content');
});
```

#### User interactions

`testComponent` will return [fireEvent](https://testing-library.com/docs/guide-events/) method for events simulation:

```tsx
/**
 * @jest-environment jsdom
 */

import { useState } from 'react';
import { testComponent } from '@tramvai/test-react';

const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <h3>{count}</h3>
      <button onClick={() => setCount(count + 1)}>Click</button>
    </>
  );
};

it('click', async () => {
  // the same methods as from `@tramvai/test-react`
  const { fireEvent, screen } = testComponent(<Component />);

  expect(screen.getByRole('heading').textContent).toBe('0');

  await fireEvent.click(screen.getByRole('button'));

  expect(screen.getByRole('heading').textContent).toBe('1');
});
```

#### DI providers

As many other `tramvai` testing utilities, you can pass custom DI or providers to `testComponent`:

```tsx
/**
 * @jest-environment jsdom
 */

import { createToken } from '@tramvai/core';
import { useDi } from '@tramvai/react';
import { testComponent, screen } from '@tramvai/test-react';

const CONTENT_TOKEN = createToken<string>('content');

const Component = () => {
  const content = useDi(CONTENT_TOKEN);

  return <div data-testid="test">{content}</div>;
};

it('di', () => {
  testComponent(<Component />, {
    providers: [{ provide: CONTENT_TOKEN, useValue: 'Content from DI' }],
  });

  expect(screen.getByTestId('test').textContent).toBe('Content from DI');
});
```

#### Connected components

`testComponent` allow you to provide any stores or initial state and will return `context` instance for events or actions runs:

```tsx
/**
 * @jest-environment jsdom
 */

import { createReducer, createEvent, useStore } from '@tramvai/state';
import { testComponent } from '@tramvai/test-react';

const incrementEvent = createEvent('increment');

const CountStore = createReducer('count', 0)
  .on(incrementEvent, (state) => state + 1);

const Component = () => {
  const count = useStore(CountStore);

  return <h3>{count}</h3>;
};

it('state', async () => {
  const { context, act, screen } = testComponent(<Component />, {
    stores: [CountStore]
  });

  expect(screen.getByRole('heading').textContent).toBe('0');

  // act is required for react@18 concurrent features, we need to wait for state update and component rerender
  await act(() => {
    context.dispatch(incrementEvent());
  });

  expect(screen.getByRole('heading').textContent).toBe('1');
});
```

#### Hooks

`testHook` API looks looks very similar to `testComponent`:

```tsx
/**
 * @jest-environment jsdom
 */

import { useStore } from '@tramvai/state';
import { testHook } from '@tramvai/test-react';

const useCountStore = () => {
  return useStore(CountStore);
};

it('hook', async () => {
  const { result, context, act } = testHook(() => useCountStore(), {
    stores: [CountStore],
  });

  expect(result.current).toBe(0);

  await act(() => {
    context.dispatch(incrementEvent());
  });

  expect(result.current).toBe(1);
});
```

## Integration tests

For any web applications, comprehensive testing requires running that application in a browser.
For SSR applications, another main requirement is to build and start server code of the application.

We will use `jest` and `puppeteer` in examples below.

`tramvai` provides few packages for integration testing:

- `@tramvai/test-integration` responsible for running application
- `@tramvai/test-integration-jest` contains `jest` configuration
- `@tramvai/test-puppeteer` provides wrappers for testing application in-browser

### Setup test suite

Test suite in `jest` terms is the root `describe` block in the test file.
We need to build and run application once for test suite, and close application server when test suite is finished.

`@tramvai/test-integration` export `startCli` method, which works similar to `tramvai new` command.
This API allows to configure application build, for example provide any environment variables or run application on different port.

:::caution

`startCli` makes development build of the application

:::

Let's create a minimal test suite example:

```ts
import type { StartCliResult } from '@tramvai/test-integration';
import { startCli } from '@tramvai/test-integration';

describe('testing-app', () => {
  // `startCli` will return some useful testing API's, which we will use later in test cases
  let app: StartCliResult;

  // build and run once
  beforeAll(async () => {
    // pass application name, which will be resolved from `tramvai.json`
    app = await startCli('testing-app', {
      // pass any environment variables
      env: {
        SOME_ENV: 'test',
      },
    });
  // timeout depends on your application build time
  }, 80000);

  // close after end
  afterAll(() => {
    return app.close();
  });
});
```

### Test without browser

For testing requests to the tramvai app pages (aka `curl`) libraries [supertest](https://github.com/visionmedia/supertest) and [node-html-parser](https://github.com/taoqf/node-html-parser) are used under hood.

Call of `app.request` sends requests to the app. All of the features of `supertest` are available.

Call of `app.render` resolves to the HTML render that is returned from server while serving the request.

For example, we want to check that the page `/` returns 200 status code and application content in the HTML:

```ts
it('request', async () => {
  // `supertest` API, send request to root page
  const response = await app.request('/')
    // test status code
    .expect(200)
    // test headers
    .expect('X-App-Id', 'testing-app');

  // test application content
  expect(response.text).toMatch('<div class="application">rootPage</div>');
});
```

As alternative to `response.text`, we can test parsed HTML result:

```ts
it('render', async () => {
  const page = await app.render('/');

  // test application content, already parsed
  expect(page.application).toMatch('rootPage');

  // or use `node-html-parser` API, which is similar to DOM API
  expect(page.parsed.querySelector('.application').innerHTML).toMatch('rootPage');
});
```

### Usage of `@tinkoff/mocker` in tests

In order to use mocker there should be added [`@tramvai/module-mocker`](references/modules/mocker.md) to the tramvai app modules list.

:::tip

`@tramvai/module-mocker` works by replacing mocked API env variables when application starts.

You can pass list of mocked env variables directly in `MockerModule`, and it will not affect production code, for integration tests all requests to API without specific mocks just will be proxied to original env value:

```ts
MockerModule.forRoot({
  config: async () => ({
    apis: ['AWESOME_API'],
  }),
});
```

Or add a file in the `mocks` folder:

```ts title="mocks/awesome-api.js"
module.exports = {
  api: 'AWESOME_API',
  mocks: {},
}
```

`app.mocker.addMocks` will have no effect if mocked API (method first argument) not in the list!

:::

After that mocker will read file based mocks as described in the docs to the mocker itself and it can be used dynamically in the tests:

```ts
it('should work with mocker', async () => {
  // AWESOME_API - env variable with target API base url
  await app.mocker.addMocks('AWESOME_API', {
    // api endpoint method, pathname and response
    'GET /endpoint/': {
      status: 200,
      payload: {
        status: 'OK',
        response: 'smth',
      },
    },
  });

  await app.request('/some-page/').expect(200);

  // clear HTTP clients cache for fresh requests
  await app.papi.clearCache();
  await app.mocker.removeMocks('AWESOME_API', ['GET /endpoint/']);

  await app.request('/some-page/').expect(500);
});
```

### Papi testing

For [papi](features/papi/introduction.md) methods testing you can use `app.papi` wrapper methods `publicPapi` and `privatePapi` with all `supertest` features.

For example, let's make request to built-in papi method which returns all application routes in payload:

```ts
it('papi', async () => {
  const response = await app.papi.publicPapi('bundleInfo').expect(200);

  expect(response.body).toMatchInlineSnapshot(`
    {
      "payload": [
        "/",
      ],
      "resultCode": "OK",
    }
  `);
});
```

### Puppeteer

#### Setup

`puppeteer` instance need to be initialized in the start of the test suite, and closed in the end:

```ts
import { initPuppeteer } from '@tramvai/test-puppeteer';

it('puppeteer', async () => {
  // pass application url, usually http://localhost:3000
  const { browser } = await initPuppeteer(app.serverUrl);

  // ...

  return browser.close();
});
```

#### New page

Default example, open `/second-page/` application url in browser, step by step:

```ts
import {
  initPuppeteer,
  // highlight-next-line
  wrapPuppeteerPage,
} from '@tramvai/test-puppeteer';

it('puppeteer', async () => {
  const { browser } = await initPuppeteer(app.serverUrl);

  // highlight-start
  // open empty browser tab
  const page = await browser.newPage();
  // wrapper required for better logs
  const wrapper = wrapPuppeteerPage(page);

  // equivalent to navigate browser tab to "http://localhost:3000/second-page/" url
  await page.goto(`${app.serverUrl}/second-page/`);
  // highlight-end

  return browser.close();
});
```

The same, but simplified example:

```ts
it('puppeteer', async () => {
  const { browser, getPageWrapper } = await initPuppeteer(app.serverUrl);

  // highlight-next-line
  const { page } = await getPageWrapper(`${app.serverUrl}/second-page/`);

  return browser.close();
});
```

#### Navigation

Page wrapper return special `router` object, which works directly with `tramvai` router on the page:

```ts
it('puppeteer', async () => {
  const { browser, getPageWrapper } = await initPuppeteer(app.serverUrl);

  // highlight-start
  const { router } = await getPageWrapper(`${app.serverUrl}/second-page/`);

  // SPA-navigation with SpaRouterModule, hard reload with NoSpaRouterModule.
  // equivalent to `pageService.navigate('/third-page/')`
  router.navigate('/third-page/');

  // update current url or router params without reloading, if possible.
  // equivalent to `pageService.updateCurrentRoute({ query: { foo: 'bar' } })`
  router.updateCurrentRoute({ query: { foo: 'bar' } });
  // highlight-end

  return browser.close();
});
```

#### Page interaction

`puppeteer` provides a lot of different API's, here is some useful for testing:

- [page.evaluate](https://pptr.dev/api/puppeteer.page.evaluate) is main method for execute code in the page context.
- [page.$eval](https://pptr.dev/api/puppeteer.page._eval) is alias over page `document.querySelector`.

In example below we will check `.application` element content with both methods:

```ts
it('puppeteer', async () => {
  const { browser, getPageWrapper } = await initPuppeteer(app.serverUrl);

  const { page } = await getPageWrapper(app.serverUrl);

  // highlight-start
  const pageUrl = await page.evaluate(() => window.location.pathname);
  const pageContent = await page.$eval('.application', (node) => node.innerHTML);

  expect(pageUrl).toEqual(`/`);
  expect(pageContent).toEqual('Main page');
  // highlight-end

  return browser.close();
});
```

#### Client-side requests interception

For example, we want to block any requests to `https://www.test.api.example`:

```ts
it('puppeteer', async () => {
  const { browser, getPageWrapper } = await initPuppeteer(app.serverUrl);

  const { page } = await getPageWrapper(app.serverUrl);

  // highlight-start
  // enable requests interception
  page.setRequestInterception(true);

  // listen for all requests
  page.on('request', (req) => {
    // check request url
    if (req.url() === 'https://www.test.api.example/') {
      // send 500 response
      req.respond({
        status: 500,
        contentType: 'text/plain',
        body: 'Blocked',
      });

      return;
    }

    // allow all other requests
    return req.continue();
  });
  // highlight-end

  return browser.close();
});
```
