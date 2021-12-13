---
id: action
title: Action
---

Actions are needed in the application to localize the execution of asynchronous actions, for example, make a request, update data in the store, and other actions that affect IO or state management.

Detailed description of the interface [createAction](references/tramvai/create-action.md)

## Example action

```tsx
import { createAction } from '@tramvai/core';

// create an action
const actionFetchData = createAction({
  name: 'fetch-data',
  fn: (context, payload) => fetch(payload.url),
});

// execute the action
context
  .executeAction(actionFetchData, { url: 'https://tinkoff.ru' })
  .then((data) => context.dispatch(loadData(data)));
```

## Global Actions

Applications can add global actions in the application that need to be executed before rendering the page, in these actions they usually load the information necessary to display the page, for example, information about deposits. Before rendering the page, the different types of actions are collected into a single list and executed in parallel.

In short, an action is global if added via `createApp`, `createBundle`, or a static property of a page component, such as `PageComponent.actions`. By default, global actions are executed once, on the server, and pass the status and result of the action to the client.

### Execution Deadline

Servers must respond quickly, so we must reduce the number of cases when global actions cause a delay in page loading, for example, if an API fails. To do this, there is a time limit on the server for executing global actions, and if this time passes, then waiting for actions ends and these actions must be executed on the client side.

### Synchronizing actions between server and client

Information about all successfully executed actions will be transferred to the client, which will start the execution of global actions based on this information. At the same time, if an action, for example, fell out of the deadline or fell by mistake, then it will be re-executed on the client side.

### Errors in actions

By default, errors in actions only logged with event `action-execution-error`, but they do not stop the page rendering pipeline.
The only exceptions are actions that throw `NotFoundError` or `RedirectFoundError` errors from `@tinkoff/errors` library.

When `new RedirectFoundError({ nextUrl })` is thrown, the page request will be redirected to `nextUrl` with `308` status (default).

When `new NotFoundError()` is thrown, the page request will have a status of `404` (default), and if your application has `not-found` route, that route **will not be render**.

### Types of global actions

#### Application-wide global actions

To register within the application, we must pass an array of actions to [createApp](references/tramvai/create-app.md), after that all these actions will be executed for each page and any bundles:

##### Connection

```tsx
createApp({
  name: 'myApp',
  actions: [loadDepositConfig],
});
```

You can also register actions with providers:

```tsx
import { ACTIONS_LIST_TOKEN } from '@tramvai/core';
import { provide } from '@tramvai/core';

const provider = provide({
  provide: ACTIONS_LIST_TOKEN,
  multi: true,
  useValue: [loadDepositConfig],
});
```

#### Global actions for the bundle

To register inside a bundle, we must pass to [createBundle](references/tramvai/create-bundle.md) a list of actions that will then be executed for all pages that are present and used in the bundle.

##### Connection

```tsx
createBundle({
  name: 'bundle',
  actions: [loadDepositConfig],
});
```

#### Global actions linked to the page

This is the lowest level of adding global actions, for a separate Page component, we can bind a list of actions that need to be performed before rendering the page.

##### Connection

To do this, you need to add a static property to the page of the `actions` component and pass the list of required actions

```tsx
class PageComponent extends Copmponent {
  static actions = [loadDepositConfig];
}
```

## Restrictions

Not all actions can be executed under all circumstances, we can have actions that should be executed only on the server, others only in the browser, and having any other restrictions. There is a `conditions` property to solve this problem:

```tsx
createAction({
  name: 'fetch-data',
  fn: (context, payload) => fetch(payload.url),
  conditions: {
    requiredCoreRoles: ['client'],
    onlyBrowser: true,
  },
});
```

In the example above, we create an action that will be executed only in the browser and only when we have the user role of the main core API equal to `client`.

### Adding new restrictions to the application

You can implement your own constraints in an application or module. To do this, we must create an object with an interface:

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
- `conditions` - restrictions for the current action
- `type` - type of the executed action, can be global or simple execution via executeAction
- `forbid` - prohibits the execution of the action. If at least one checker calls this function, the action execution will be stopped
- `setState` - allows you to write the check data. It is necessary for cases when we need to know with what data it was executed before and whether it needs to be repeated, for example, restrictions on the authorization role
- `getState` - getting the previously recorded state
- `allow` - tell the action to be executed again. The action will execute unless execution is forbidden via `forbid`

### Example of a constraint

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

### Connecting restrictions to the application

To do this, you need to add the `multi` provider `ACTION_CONDITIONALS` and pass a function that will have an interface

```tsx
import { provide } from '@tramvai/core';

const provider = provide({
  provide: ACTION_CONDITIONALS,
  multi: true,
  useValue: [onlyServer],
});
```

### Preset limits available for each action

- _`always`_ - the action is executed on the server, then in the browser and on each SPA transition within the application
- _`onlyBrowser`_ - the action is executed only in the browser
- _`onlyServer`_ - the action is executed only on the server
- _`pageBrowser`_ - the global action is executed only in the browser
- _`pageServer`_ - the global action is executed only on the server
- _`always`_ + _`onlyBrowser`_ - the action is executed in the browser and for each SPA transition within the application

## Peculiarities

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