---
id: action
title: Actions
---

## Explanation

Actions is the standard way to perform any side-effects in the application, including:
- making requests
- dispatching store events
- redirects and navigation
- logging and analytics

There is two ways to execute actions - automatically (we call it [**global actions**](#global-actions), usually it is **page actions**) and manually, in React components or nested calls inside another actions.

Actions have a lot of optimizations for achieving the best latency for application server responses.

### Interface

You can find `declareAction` interface in [`@tramvai/core` package documentation](references/tramvai/core.md#declareaction)

### Lifecycle

Actions can be executed at different stages:
- Server-side, for every request
- Client-side, after page initialization
- Client-side, after SPA transition
- Anywhere manually

By default, all global actions will be executed by [router](03-features/07-routing/01-overview.md) on the server in parallel, at [resolvePageDeps](03-features/06-app-lifecycle.md#resolve_page_deps) `commandLineRunner` stage, before page rendering.

This behaviour can be changed by actions [conditions](#conditions) or in the case of exceeded [execution time](#execution-deadline) or [errors](#synchronizing-between-server-and-client)

Client-side actions behaviour is visualized in [Navigation Flow page](03-features/07-routing/02-navigation-flow.md)

### Global actions

In short, action is global if added via `createApp` or a static property of a page component, such as `MainPage.actions`. Only for this kind of actions some features will be available, for example, parallel execution and [execution deadline](#execution-deadline).

You can imagine global actions as flat list of async operations, and for every page their own list will be created and executed for every request.

Also, some [conditions](#conditions) will be applied only to global actions.

## Features

- [Parallel execution](#lifecycle) - all global actions will be executed on the same time
- [Execution deadline](#execution-deadline) - global actions have a short server-side timeout with [client synchronization](#synchronizing-between-server-and-client)
- Error tolerance - failed actions will be skipped and [synchronized with the client](#synchronizing-between-server-and-client)
- [Dependency Injection](concepts/di.md) - easy access to all application [DI providers](concepts/provider.md)
- [Conditions](#conditions) - you can specify conditions for executing actions, for example, run some only in the browser

### Execution Deadline

Servers must respond quickly, so we must reduce the number of cases when global actions cause a delay in page loading, for example, if an API fails. To do this, there is a time limit (`500ms`) on the server for executing global actions, and if this time passes, then waiting for actions ends and these actions must be executed on the client side.

### Synchronizing between server and client

Information about all successfully executed actions will be transferred to the client, which will start the execution of global actions based on this information. At the same time, if an action, for example, fell out of the deadline or fell by mistake, then it will be re-executed on the client side.

:::info

Unique actions names are required for correct synchronization between server and client

:::

## Recommendations

- For API calls, always try to separate the business and requests logic from actions in favour of specific services, which can be used in actions or [React-Query](references/modules/react-query.md)
- Actions is the good place to combine fetching and state management logic
- Try to create actions with unique names, because they will be used for [synchronization between server and client](#synchronizing-between-server-and-client)
- Subscribe to [abortSignal](#abortcontroller) if you make requests in actions

## Quick Start

:hourglass: Create a new action:

```ts
import { declareAction } from '@tramvai/core';

const logAction = declareAction({
  name: 'log',
  fn() {
    console.log('logged!');
  },
});
```

:hourglass: Register action for page component:

```tsx
import type { PageComponent } from '@tramvai/react';

const MainPage: PageComponent = () => <h1>Main Page</h1>;

// highlight-next-line
MainPage.actions = [logAction];

export default MainPage;
```

This action will be executed only for this page and only on the server-side (because of [synchronization](#synchronizing-between-server-and-client)).

## Usage

### Page actions

The most common way to use actions - is to fetch some data from API for specific page.

You need to use `actions` static property of [page components](03-features/03-pages.md#actions) to declare **global** actions which will be executed only for this page.

Actions execution result will not be connected with page directly, and you need to create specific [reducer](03-features/08-state-management.md#reducer) for this data as transport layer between action and page component.

:::tip

[React-Query](references/modules/react-query.md) is the great tool to reduce boilerplate for fetching data with interface similar to `declareAction`

:::

Example with data fetching and custom reducer, let's imagine that we create a chat page:

```tsx
import type { PageComponent } from '@tramvai/react';
import { createReducer, createEvent, useStore } from '@tramvai/state';
import { declareAction } from '@tramvai/core';

export const messagesLoaded = createEvent('messages loaded');

// data will be saved here on the server and transferred to the client automatically
export const MessagesStore = createReducer<Message[]>('messages', []).on(
  messagesLoaded,
  (state, payload) => payload
);

// action will be executed at server-side
const loadMessagesAction = declareAction({
  name: 'load-messages',
  async fn() {
    const messages = await loadMessagesFromApi();

    this.context.dispatch(messagesLoaded(messages));
  },
});

const ChatPage: PageComponent = () => {
  // page will be rendered with the same data on the server and hydrated on the client
  const messages = useStore(MessagesStore);

  return (
    <>
      <h1>Messages</h1>
      {messages.map((message) => (
        <Message key={message.id} text={message.text} />
      ))}
    </>
  );
};

// reducer and action will be registered only for this page
ChatPage.reducers = [MessagesStore];
ChatPage.actions = [loadMessagesAction];

export default ChatPage;
```

### Application actions

Another way to register **global** actions is to register them in the application level in `createApp` method. This actions will be executed for every application page:

```tsx
createApp({
  name: 'awesome-app',
  actions: [loadSomeGlobalConfiguration],
});
```

Also you can register application-wide action with `ACTIONS_LIST_TOKEN` - it is useful when you want to separate some global logic in independed module:

```tsx
import { provide } from '@tramvai/core';
import { ACTIONS_LIST_TOKEN } from '@tramvai/core';

const provider = provide({
  provide: ACTIONS_LIST_TOKEN,
  multi: true,
  useValue: [loadSomeGlobalConfiguration],
});
```

### Execute actions in React components

Use [`useActions`](03-features/08-state-management.md#useactions) hook if you want to execute actions manually.

### Parameters

When you declare action, you can declare `fn(...args: any[])` property with any amount of arguments, and then you can pass it to action when you execute it:

```tsx
import { declareAction } from '@tramvai/core';
import { useActions } from '@tramvai/state';

const loadProductAction = declareAction({
  name: 'load-product',
  // declare typed params
  async fn(id: number, timeout = 1000) {
    return fetchProductById(id, { timeout });
  },
});

const ProductCard = ({ id }: { id: number }) => {
  const [product, setProduct] = useState(null);
  // bind action to the context
  const loadProduct = useActions(loadProductAction);

  useEffect(() => {
    // pass nessesary params
    loadProduct(id).then((response) => {
      setProduct(response);
    });
  }, [id]);

  return <>...</>;
}
```

### Context

[ConsumerContext](03-features/08-state-management.md#context) is available in the action `fn` function in `this` context.

With Context for example you can execute nested actions inside global, or dispatch store [events](03-features/08-state-management.md#event):

```tsx
import { declareAction } from '@tramvai/core';
import type { PageComponent } from '@tramvai/react';

const nestedAction = declareAction({
  name: 'nested',
  async fn() {
    await doAsyncStuff();
  }
});

const rootAction = declareAction({
  name: 'root',
  async fn() {
    // highlight-next-line
    await this.executeAction(nestedAction);

    // highlight-next-line
    this.dispatch(someEvent());
  }
});

const MainPage: PageComponent = () => <h1>Main Page</h1>;

MainPage.actions = [rootAction];

export default MainPage;
```

### Dependencies

Actions has full Dependency Injection support, so you can declare dependencies like in [DI providers](concepts/provider.md), in `deps` property. This dependencies will be available in the action `fn` function in `this.deps` property.

For example, let's use [tramvai logger](references/libs/logger.md) inside action:

```tsx
import { declareAction } from '@tramvai/core';
import { LOGGER_TOKEN } from '@tramvai/tokens-common';

const logAction = declareAction({
  name: 'log',
  fn() {
    // highlight-next-line
    const { logger } = this.deps;

    logger.info('logged!');
  },
  deps: {
    logger: LOGGER_TOKEN,
  },
});
```

### AbortController

Any actions has their own execution context, which is regulated by the [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) API. What does it mean for application developers:
- You can subscribe to parent abort signal through `this.abortSignal` in action `fn` function
- You can cancel requests in nested actions through `this.abortController.abort()` in action `fn` function

Subscription to `this.abortSignal` is important, because when execution timeout will be exceeded, this actions will be ignored, and can make some unnecessary work on the server-side. Also it allows to control nested actions.

For example, we want to subscribe `this.abortSignal`, and force some deadline for nested action:

```ts
const innerAction = declareAction(/** ... */);

const action = declareAction({
  name: 'root',
  async fn() {
    // after timeout exceeds, first request or request in innerAction will be aborted
    setTimeout(() => {
      this.abortController.abort()
    }, 1000);

    const { payload } = await this.deps.httpClient.request({
      url: 'https://www.domain.com/api/endpoint',
      // pass signal to the request
      signal: this.abortSignal,
    });

    // if innerAction1 ends after abortController.abort was called
    // then calling innerAction2 will throw an instance of ExecutionAbortError
    await this.executeAction(innerAction, payload);
  },
  deps: {
    httpClient: HTTP_CLIENT,
  },
});
```

### Conditions

Not all actions can be executed under all circumstances, i.e. we can have actions that should be executed only on the server, others only in the browser, and having any other conditions. There is a `conditions` property to solve this problem:

```tsx
declareAction({
  name: 'fetch-data',
  fn() {
    return fetch(payload.url);
  },
  conditions: {
    // highlight-next-line
    onlyBrowser: true,
  },
});
```

In the example above, we create an action that will be executed only in the browser.

#### Adding new conditions to the application

You can implement your own execution conditions in an application or module. To do this, we must create an object with an interface:

```tsx
interface Condition {
  key: string;
  fn(checker: ActionConditionChecker): void;
}
```

- `key` - restriction identifier
- `fn` - a validation function that will be called for each action

The function will receive in the argument checker, which has an interface

```tsx
interface ActionConditionChecker {
  payload: any;
  parameters: any;
  type: 'global' | 'local';
  conditions: Record<string, any>;
  forbid(): void;
  setState(value: any): void;
  getState(): any;
  allow(): void;
}
```

- `payload` - data that was transferred with the action
- `parameters` - parameters that were passed when creating the action
- `conditions` - conditions for the current action
- `type` - type of the executed action, can be global or simple execution via executeAction
- `forbid` - prohibits the execution of the action. If at least one checker calls this function, the action execution will be stopped
- `setState` - allows you to write the check data. It is necessary for cases when we need to know with what data it was executed before and whether it needs to be repeated, for example, conditions on the authorization role
- `getState` - get the previously recorded state
- `allow` - tell the action to be executed always. The action will execute unless execution is forbidden via `forbid`

#### Example of a constraint

```tsx
const isServer = typeof window === 'undefined';

export const onlyServer: ActionCondition = {
  key: 'onlyServer',
  fn: (checker) => {
    if (checker.conditions.onlyServer && !isServer) {
      checker.forbid();
    }
  },
};
```

After connecting, the constraint will look if the action has a `onlyServer` field in `conditions`, and if so, it will change the action's behavior

#### Connecting conditions to the app

To do this, you need to add the `multi` provider `ACTION_CONDITIONALS` and pass a function that will have an interface

```tsx
import { provide } from '@tramvai/core';

const provider = provide({
  provide: ACTION_CONDITIONALS,
  multi: true,
  useValue: [onlyServer],
});
```

#### Predefined presets

- _`always`_ - the action is executed on the server, then in the browser and on each SPA transition within the application
- _`onlyBrowser`_ - the action is executed only in the browser
- _`onlyServer`_ - the action is executed only on the server
- _`pageBrowser`_ - the [global](#global-actions) action is executed only in the browser
- _`pageServer`_ - the [global](#global-actions) action is executed only on the server
- _`always`_ + _`onlyBrowser`_ - the action is executed in the browser and for each SPA transition within the application

### Dynamic parameters and SPA-transitions

Keep in mind that actions are **cached** by default and are only executed **once** during the life cycle of the application.

The following feature follows from this.

Let's assume the following situation:

- we have a page of the concert venue at the url `/concertvenue-[objectId]` - where `objectId` is a parameter that corresponds to the concert venue identifier;
- on this page we have one component `ConcertVenuePage` and one page action `preparePageAction`;
- `objectId` in the url of the page is used to get data in `preparePageAction`, as well as to fetch data for rendering the page;
- we have a concert page `/concert` on which there are links to concert venues -`/concertvenue-1`, `/concertvenue-2`, `/concertvenue-1`. We can navigate to all these links with a SPA transition;
- Transitions between pages are client-side (SPA), not server-side;

Sequencing:

1. On the concert page we click on `/concertvenue-1`, the page of the concert venue opens, the page action is performed **for the first time**.
2. We go back to the SPA concert page by transition.
3. Click on `/concertvenue-2`.
4. We get to an empty page, since the page action has already **been executed**, new data has not been requested, and the data selection for drawing the page was made according to ID from url - 2.

If you want a page action to be executed every time you visit the page, you need to pass it the appropriate condition:

```tsx
const preparePageAction = creareAction({
  name: 'preparePageAction',
  fn: () => {
    // ...
  },
  conditions: {
    // with always: true, the action will always be called and not cached
    always: true,
  },
});

ConcertVenuePage.actions = [preparePageAction];
```

Also, you can't pass [parameters](#parameters) to the global actions, because they are called automatically. Better way is to get nessessary parameter from DI, for example if action depends on [route dynamic parameter](03-features/07-routing/03-working-with-url.md#route-params), you can use `PAGE_SERVICE_TOKEN`:

```tsx
const preparePageAction = creareAction({
  name: 'preparePageAction',
  async fn() {
    const { pageService } = this.deps;
    const { id } = pageService.getCurrentRoute().params;

    await loadConcert(id);
  },
  conditions: {
    always: true,
  },
});

ConcertVenuePage.actions = [preparePageAction];
```
