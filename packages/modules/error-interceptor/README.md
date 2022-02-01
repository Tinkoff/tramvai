# Error interceptor

Wrapper module for the [@tinkoff/error-handlers](../libs/error-handlers)

## Explanation

### Integration with tramvai

Module doesn't provide any public interface and only registers error handlers with `@tinkoff/error-handlers` which will catch errors on server and client.

### How does it work on server

Subscribes to the event `unhandledRejection` and any sudden signals and uncaughtErrors with library `death` then logs it to the console.
