# Log

Module adds `LOGGER_TOKEN` token implementation using library [@tinkoff/logger](references/libs/logger.md).

## Installation

Module is automatically installs and adds with module `@tramvai/module-common`

## Explanation

### Display logs

see [@tinkoff/logger](../libs/logger#display-logs).

> By default, on server all of the logs of level warn and above are enabled. On the client in dev-mode all the logs of level error and above are enabled while in prod-mode all of the logs on client are disabled.

### Send logs to the API

It is implied that logs from the server are collected by the external tool that has access to the server console output and because of this logging to the external API from the server is not needed.

In browser logs to the API are send with [RemoteReporter](../libs/logger.md#remotereporter). By default, all of the logs with levels `error` and `fatal` are send. The url for the API is specified by environment variable `FRONT_LOG_API`. For the customization see docs for the [RemoteReporter](../libs/logger.md#remotereporter).

### See logs from the server in browser

This functionality is available only in dev-mode and can make development a little easier.

In browser console when loading page of the app the special log group with name `Tramvai SSR Logs` will be showed. If you open this group you will see logs from the server that was logged to this particular request. Herewith will be displayed only logs that are enabled for the [displaying on the server](#display-logs). If you want to see all of the logs in browser with settings for [displaying in browser](#display-logs) you can specify env `DEBUG_FULL_SSR` when running app.

### See logs for the requests

> Works only with [@tinkoff/request](https://tinkoff.github.io/tinkoff-request/)

[http-client](references/modules/http-client.md) is already passes logger and its settings to the [log plugin](https://tinkoff.github.io/tinkoff-request/docs/plugins/log.html).

Plugin automatically generates names for loggers using template `request.${name}` that might be used to setting up [displaying of logs](#display-logs):

```tsx
const logger = di.get(LOGGER_TOKEN);
const makeRequest = request([...otherPlugins, logger({ name: 'my-api-name', logger })]);
```

As name of the logger equals to `my-api-name` to show logs:

- on server extend env `LOG_ENABLE: 'request.my-api-name'`
- on client call `logger.enable('request.my-api-name')`

### Change logger settings on server

By default, settings for the logger on server are specified by envs `LOG_ENABLE` and `LOG_LEVEL`.

You can change this settings in runtime using papi-route `{app}/private/papi/logger`

Displaying of the logs is changed by query with the name `enable`, e.g.:

```
https://localhost:3000/{app}/private/papi/logger?enable=request.tinkoff
```

Level of the logs is change by query with the name `level`, e.g.:

```
https://localhost:3000/{app}/private/papi/logger?level=warn
```

To reset settings to default, based on env, use `mode=default`:

```
https://localhost:3000/{app}/private/papi/logger?mode=default
```

### Env

- `LOG_LEVEL` = trace | debug | info | warn | error | fatal - show logs with specified level and higher. E.g.:
  - if `LOG_LEVEL=info` then logs with levels `info`, `warn`, `error`, `fatal` will be showed
- `LOG_ENABLE` = `${name}` | `${level}:${name}` - show logs with specified name of the logger or name + level. Several entries are passed with comma as delimiter. E.g.:
  - if `LOG_ENABLE=server` then show logs with the name `server`
  - if `LOG_ENABLE=trace:server*` then show logs with the name `server` and level `trace`
  - if `LOG_ENABLE=info:server,client,trace:shared` then show all of the specified logs using rules from above

### Debug

Module uses logger with the id `ssr-logger`

## How to

### Example of base usage

```tsx
import { Module, commandLineListToken, provide } from '@tramvai/core';
import { LOGGER_TOKEN } from '@tramvai/module-common';

@Module({
  providers: [
    provide({
      provide: commandLineListToken.customerStart,
      useFactory: ({ logger }) => {
        logger.debug('customer start'); // logging in the global namespace

        const myLogger = logger({
          name: 'test',
        });

        myLogger.warn('warning'); // logging in the namespace test
        myLogger.error('error!');
      },
      deps: {
        logger: LOGGER_TOKEN,
      },
    }),
  ],
})
export class MyModule {}
```

### How to properly format logs

See [@tinkoff/logger](../libs/logger.md#how-to-log-properly)

## Exported tokens

### LOGGER_TOKEN

Instance of the logger. Replaces base implementation for the `LOGGER_TOKEN` from the [@tramvai/module-common](references/modules/common.md)
