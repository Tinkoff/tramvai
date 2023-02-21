---
id: app-lifecycle
title: Application Lifecycle
---

When processing a client request, we need to perform a standard list of actions, such as getting a route, getting the desired data for the client, rendering the application and responding to the client. At the same time, we have a modular system, when the modules do not know about each other, but they need to be connected somehow.

To solve this problem, `commandLineRunner` was developed, which contains a fixed list of stages in which modules can add the necessary tasks through providers. All stages are executed sequentially, but the commands registered for each individual step are executed in parallel.

## Explanation

### Application flow

`tramvai` have a simple lifecycle for application in general:

- `init`
- `listen`
- `close`

This flow will be started only once for application server code, and once for browser code.

![Application flow](/img/commands/command-line-app-flow.drawio.svg)

### Request flow

For every user request to the `tramvai` server, and for page initalization in the browser, there is a more complex lifecycle:

- `customer_start`
- `resolve_user_deps`
- `resolve_page_deps`
- `generate_page`
- `clear`

So, in server-side, request flow will be executed multiple times for different clients, and only one time in browser.

![Request flow](/img/commands/command-line-request-flow.drawio.svg)

### SPA transition flow

SPA transition lifecycle use some of request flow stages, and few custom, and executed only client-side:

- `resolve_user_deps`
- `resolve_page_deps`
- `spa_transition`
- `after_spa_transition`

![SPA transition flow](/img/commands/command-line-spa-flow.drawio.svg)

### Execution timings

You may either get execution timings for single request with [server module](references/modules/server.md#server-timing) or get the aggregated values with [metrics module](references/modules/metrics.md)

## Usage

We have registered a new provider that will be called when `commandLineRunner` reaches the `commandLineListTokens.customerStart` token and the `readCustomCookie` function is executed:

```tsx
import { commandLineListTokens, provide } from '@tramvai/core';
import { COOKIE_MANAGER_TOKEN } from '@tramvai/tokens-common';

createApp({
  providers: [
    provide({
      provide: commandLineListTokens.customerStart,
      useFactory: ({ cookieManager }) => {
        return function readCustomCookie() {
          // this will work both on server and client sides
          console.log('custom cookie value is:', cookieManager.get('custom'));
        };
      },
      deps: {
        cookieManager: COOKIE_MANAGER_TOKEN,
      },
    }),
  ],
});
```

### Aborting Execution

In some cases CommandLineRunner may try to abort execution of the lines. In such cases any actions that implement heavy logic must subscribe to the commandLineRunner's execution context to subscribe to the abort event in order to prevent doing needless actions.

1. Use token [`COMMAND_LINE_EXECUTION_CONTEXT_TOKEN`](references/tokens/common.md) to get current execution context related to the CommandLineRunner line execution (if there is not line execution this token will be null)
2. Use context's `abortSignal` to subscribe to events of aborting execution

Example:
```ts
import { provide, commandLineListTokens } from '@tramvai/core';
import { COMMAND_LINE_EXECUTION_CONTEXT_TOKEN } from '@tramvai/tokens-common';

createApp({
  providers: [
    provide({
      provide: commandLineListTokens.resolveUserDeps,
      useFactory: ({ commandLineExecutionContext }) => {
        return async function handler() {
          const executionContext = commandLineExecutionContext();

          // pass signal from execution context
          await someLongAction({ signal: executionContext.abortSignal });

          // check if execution was aborted while long action has been executing
          if (!execution.abortSignal.aborted) {
            await anotherAction();
          }
        }
      },
      deps: {
        commandLineExecutionContext: COMMAND_LINE_EXECUTION_CONTEXT_TOKEN
      },
    }),
  ],
});
```

## Commands

Command - is just async function without any parameters:

```ts
async function doSomething() {}
```

:::tip

Create functions with unique names, it is very useful for debugging and error logging

:::

If command will reject error, it will fail current flow, for example if you will have error in `init` stage command, application server will not be started, **application flow** will be failed.

There is no timeouts for commands, so be careful when fetching some data on **request flow** stages - use caching and timeouts, otherwise page response time can be worse.

### init

Global services initialization, for example - app `fastify` server will be created and configured on this stage.

_For what_: If you need to initialize global singletons asynchronously

### listen

Subscribing to global events by the application, for example - app `fastify` server and dev static server started listen ports at this stage

_For what_: Almost never, but okay if you need to subscribe to global events or listen a some port

### close

Before closing the application, some modules may need to perform special actions, for example, close connections, send data and similar activities. In order not to duplicate the application closure tracking code in each module, this stage was made.

_For what_: Almost never, but okay if you need to perform actions before closing the application. for example close connections, send logs and so on

### customer_start

The starting token in the client request processing chain. Required to initialize custom asynchronous constructors. For example, `tramvai` Router will be initialized for current request at this stage.

It is not advised to do any lengthy asynchronous tasks at this stage, as only synchronous actions are expected.

_For what_: To initialize asynchronous services for each client

### resolve_user_deps

The main goal of this stage is to find out all the necessary information about the client we are currently processing.

Since all actions within one stage are performed in parallel with us, it is at this stage that you can efficiently and quickly request all the necessary information, for example, simultaneously with the request for customer data, you can find out about the status of the customer's authorization, get analytical information about the customer and similar actions.

_For what_: To request any global customer information

### resolve_page_deps

At this stage, we already know about the client, about what this page is. But, we have not requested the necessary data for the page. For example: request resources from the admin panel, get a list of regions, load the necessary page blocks. And all the information that will be needed when generating the page.

At this stage, it is not worth doing long asynchronous actions and it is supposed to be cached or moved to `resolveUserDeps` to achieve the maximum speed of response to clients.

At this stage, [action](concepts/action.md) is executed and perhaps they will suit you better, as there are many additional functionality, and you can specify different actions for different pages, otherwise `resolveUserDeps` will be executed for every page.

_For what_: To get the information needed to render the page

### generate_page

At this stage, we already know the current route, which client and all actions for the page have already been loaded. And at this stage, according to the information from the previous stages, we generate an HTML page and give it to the client.

_For what_: This is more of an internal stage and should not be used in ordinary cases. Since [race condition](https://en.wikipedia.org/wiki/Race_condition) with application rendering.

### clear

This stage will be called after we have responded to the client, but some modules or libraries need to delete client data.

_For what_: The method is needed if you need to perform actions after a successful response to the user

### spa_transition

Tasks registered at this stage are executed on SPA transitions in the application. When [spaMode](references/modules/router/base.md#method-of-setting-when-actions-should-be-performed-during-spa-transitions) is `before`, page actions will be executed at this stage.

_For what_: To update meta information on the current page

### after_spa_transition

When `spaMode` is `after`, page actions will be executed at this stage.

_For what_: This is more of an internal stage and should not be used in ordinary cases.

##### - [Next: Routing - Overview](03-features/07-routing/01-overview.md)

##### - [Next: State Management](03-features/08-state-management.md)
