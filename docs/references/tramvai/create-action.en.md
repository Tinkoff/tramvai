---
id: create-action
title: createAction
---

`createAction` - Method for creating asynchronous actions. It is used both for building chains of sagas and for performing global actions when building a response to a client

[More about actions](concepts/action.md)

## createAction({ name, fn, deps, conditions })

- `name` - The name of the action, a unique identifier is expected
- `fn(context, payload, deps)` - Implementation of the action, this function will be called when the action is used, maybe `async`
  - `context` - [ConsumerContext](references/tokens/common-tokens.md#context-tokens-list)
  - `payload` - data passed to action
  - `deps` - provider instances from `deps`
- `deps` - List of providers that are needed for the action to work
- `conditions` - List of restrictions for the execution of the action

## Usage example

```tsx
import { createAction } from '@tramvai/core';

createAction({
  name: 'action log error',
  fn: (context, payload, deps) => {
    deps.logger.error('ERROR');
  },
  deps: {
    logger: 'logger',
  },
  conditions: {
    requiredCoreRoles: ['god'],
  },
});
```
