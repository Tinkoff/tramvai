---
id: command-line-runner
title: CommandLineRunner
sidebar_position: 5
---

When processing a client request, we need to perform a standard list of actions, such as getting a route, getting the desired data for the client, rendering the application and responding to the client. At the same time, we have a modular system, when the modules do not know about each other, but they need to be connected somehow.

To solve this problem, `commandLineRunner` was developed, which contains a fixed list of steps in which modules can add the necessary tasks through providers. All steps are executed sequentially, but the tasks registered for each individual step are executed in parallel.

## Usage example

We have registered a new provider that will be called when `commandLineRunner` reaches the `commandLineListTokens.generatePage` token and the `render` function is executed:

```tsx
import { provide } from '@tramvai/core';
@Module({
  providers: [
    provide({
      provide: commandLineListTokens.generatePage,
      useFactory: ({ responseManager }) => {
        return function render() {
          responseManager.setBody(ReactDOM.renderToString(<App />));
        };
      },
      deps: {
        responseManager: RESPONSE_MANAGER_TOKEN,
      },
      multi: true,
    }),
  ],
})
export class RenderModule {}
```

## Commands

A number of basic commands are predefined in the tramvai, which are performed at certain stages of the application. Based on these stages, the work of the basic tramvai modules is built and actions can be added to custom modules.

### Initialization (init)

When tramvai starts, a chain of commands is launched in which you can initialize asynchronous services (if necessary) and add basic functionality. These actions are performed only once and are not available to providers who need a custom context.

![init command](/img/commands/command-line-init.jpg)

### Handling customer requests

For each client, we run a list of actions in which the user context and data are available. For each client, we create our own di context in which the implementations will live only while we process the client's request.

![customer command](/img/commands/customer-command.drawio.svg)

### SPA transitions (spa)

For SPA transitions in the browser, routing triggers a list of actions

![spa command](/img/commands/command-line-spa.jpg)

### Shutdown (close)

Before exiting the application, this list of actions is launched

![close command](/img/commands/command-line-close.jpg)

## Tokens

### init

Initializing Asynchronous Services

_For what_: If you need to initialize global singletons asynchronously

### listen

Subscribing to global events by the application

_For what_: If you need to subscribe to global events or a port

### customer_start

The starting token in the client request processing chain. Required to initialize custom asynchronous constructors.

It is not advised to do any lengthy asynchronous tasks at this stage, as only synchronous actions are expected.

_For what_: To initialize asynchronous services for each client

### resolve_user_deps

The main goal of this stage is to find out all the necessary information about the client we are currently processing.

Since all actions within one stage are performed in parallel with us, it is at this stage that you can efficiently and quickly request all the necessary information, for example, simultaneously with the request for customer data, you can find out about the status of the customer's authorization, get analytical information about the customer and similar actions.

_For what_: To request any global customer information

### resolve_page_deps

At this stage, we already know about the client, about what this page is. But, we have not requested the necessary data for the page. For example: request resources from the admin panel, get a list of regions, load the necessary page blocks. And all the information that will be needed when generating the page.

At this stage, it is not worth doing long asynchronous actions and it is supposed to be cached or moved to `resolveUserDeps` to achieve the maximum speed of response to clients.

At this stage, [action](concepts/action.md) is executed and perhaps they will suit you better, as there are many additional functionality

_For what_: To get the information needed to render the page

### generate_page

At this stage, we already know the current route, which client and all actions for the page have already been loaded. And at this stage, according to the information from the previous stages, we generate an html page and give it to the client

_For what_: this is more of an internal stage and should not be used in ordinary cases. Since [race condition](https://en.wikipedia.org/wiki/Race_condition) with application rendering

### clear

This stage will be called after we have responded to the client, but some modules or libraries need to delete client data

_For what_: The method is needed if you need to perform actions after a successful response to the user

### spa_transition

Tasks registered at this stage are executed on SPA transitions in the application

_For what_: To update meta information on the current page

### close

Before closing the application, some modules may need to perform special actions, for example, close connections, send data and similar activities. In order not to duplicate the application closure tracking code in each module, this stage was made.

_For what_: If you need to perform actions before closing the application. for example close connections, send logs and so on

## Aborting Execution

In some cases CommandLineRunner may try to abort execution of the lines. In such cases any actions that implement heavy logic must subscribe to the commandLineRunner's execution context to subscribe to the abort event in order to prevent doing needless actions.

1. Use token [`COMMAND_LINE_EXECUTION_CONTEXT_TOKEN`](references/tokens/common.md) to get current execution context related to the CommandLineRunner line execution (if there is not line execution this token will be null)
2. Use context's `abortSignal` to subscribe to events of aborting execution

Example:
```ts
import { provide, commandLineListTokens } from '@tramvai/core';
import { COMMAND_LINE_EXECUTION_CONTEXT_TOKEN } from '@tramvai/tokens-common';

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
  }
})

```

## Errors in stages

On the server side, you can intercept errors from `commandLineRunner` stages by adding `express` error middleware with a multi token `WEB_APP_AFTER_INIT_TOKEN`.
In this middleware you can change the response status, headers and body, and end the response.
For example, exceptions when rendering React components from current page, get into this handler (`Error Boundary` not working at server-side).

Middleware example:

```js
{
  provide: WEB_APP_AFTER_INIT_TOKEN,
  multi: true,
  useFactory: (deps) => {
    return (app) => {
      app.use((err, req: Request, res: Response, next) => {
        next(err);
      });
    };
  },
  deps: {},
},
```

## Customization

The application can override the standard list of actions, for example, delete unnecessary ones or add new ones.

To do this, you need to define a provider in the application or module that will rewrite the base list

```tsx
import { provide } from '@tramvai/core';
[
  provide({
    provide: COMMAND_LINES_TOKEN,
    scope: 'singleton',
    useValue: customLines,
  }),
];
```

**_Caution_**: do not delete stages, as this may cause some modules to stop working correctly. In this case, the best solution would be to delete the module that is being linked to an unnecessary stage.
