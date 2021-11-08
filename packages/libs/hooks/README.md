# Hooks

Library used for subscription on specific events in different styles: sync, async, promise.

## Explanation

Working with lib consist of two phases:

1. Adding in the target code hook runner call, e.g. `runAsyncHooks`, with unique event key and additional parameters. It creates a slot for this event that allow to subscribe on the event.
2. Registering hook handler with `registerHooks` that will be executed when `run...` function will be called

### Caveats

There is different types hooks that are not interoperable. So carefully add new registrations with checking expected hook type.

Also you should preserve data chain, e.g. return data with same interface from hook, as it otherwise may break other hooks.

## API

#### Hooks

Create new instance of `@tinkoff/hook-runner`

```javascript
import { Hooks } from '@tinkoff/hook-runner';

const hookRunner = new Hooks();
```

#### registerHooks(key, hooks)

Register new hook for a specific key.

#### runHooks(key, context, payload, options)

Execute sync hooks. `payload` is passed through every hook and will be returned as a result (it may be changed by hooks).

#### runAsyncHooks(key, context, payload, options)

Executes async hooks using setTimeout. `payload` is passed to every hook with its initial value.

#### runPromiseHooks(key, context, options) => (payload) => Promise

Execute promise-based hooks. `payload` is passed through every hook and will be returned as a result (it may be changed by hooks)

## Hooks

### Types

#### sync

Accepts (context, payload, options). Hooks are running in order passing previous hook result as input for next hook.

#### async

Accepts (context, payload, options). Hooks are running independently from each other.

#### promise

Accepts (context, payload, options). Hooks are running in order passing previous hook result as input for next hook with wrapping call in promise.
