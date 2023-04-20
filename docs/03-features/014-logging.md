---
id: logging
title: Logging
---

## Explanation

`tramvai` uses our internal powerful and flexible [@tinkoff/logger](references/libs/logger.md) library for universal logging both on server and client side.

Token `LOGGER_TOKEN` provides a [logger factory](#logger) with shared across all application basic configuration.

### Logger

`LOGGER_TOKEN` it is both a factory and a logger at the same time, but we recommend using it **only** as a factory, which will return [child loggers](references/libs/logger.md#child-loggers), because name passed to the factory will be added to the log object in `name` field. This key is used when you want to [show only necessary logs](#display-logs).

### Main concepts

- [Child loggers](references/libs/logger.md#child-loggers)
- [Logs filters](references/libs/logger.md#filter)
- [Logs extensions](references/libs/logger.md#extension)
- [Reporters](references/libs/logger.md#reporter)
- [BeforeReporters](references/libs/logger.md#beforereporter)

### Available reporters

You can find all predefined reporters in [@tinkoff/logger](references/libs/logger.md#bundled-reporters) library documentation

## Usage

### Installation

The module is automatically installed and added with the @tramvai/module-common module.

### Configuration

#### Root logger

`LOGGER_INIT_HOOK` token is used to configure root logger (`LOGGER_TOKEN`) when it is created.

For example you want to add custom [extension](references/libs/logger.md#extension):

```ts
import { provide } from '@tramvai/core';
import { LOGGER_INIT_HOOK } from '@tramvai/tokens-common';

const provider = provide({
  provide: LOGGER_INIT_HOOK,
  useValue: (loggerInstance) => {
    loggerInstance.addExtension({
      extend(logObj: LogObj): LogObj {
        return {
          ...logObj,
          customField: 'customValue',
        };
      },
    });
  },
});
```

This extension will be applied to all child loggers, created from `LOGGER_TOKEN` factory.

#### Child logger

You can find child logger configuration example in [@tinkoff/logger](references/libs/logger.md#local-logger-configuration) library documentation

### Logging

You can get `LOGGER_TOKEN` from DI in components, actions and any other providers, for example:

```ts
import { declareAction } from '@tramvai/core';

const action = declareAction({
  name: 'myAction',
  async fn() {
    // create child logger with name 'my-action'
    const log = this.deps.logger('my-action');

    try {
      await doAsyncStuff();

      // { name: 'my-action', type: 'info', message: 'Action completed!', level, date }
      log.info('Action completed!');
    } catch (error) {
      // { name: 'my-action', type: 'error', event: 'failed', message: 'Action failed!', reason: Error, level, date }
      log.info({
        event: 'failed',
        message: 'Action failed!',
        reason: error,
      });
    }
  },
  deps: {
    logger: LOGGER_TOKEN,
  },
});
```

### Display logs

:::info

By default, on server all of the logs of level **warn** and above are enabled.

On the client in dev-mode all the logs of level **error** and above are enabled while in prod-mode all of the logs on client are disabled.

:::

Complete information about displaying logs can be found in [@tinkoff/logger](references/libs/logger.md#display-logs) library documentation.

#### Server logs

On server side logs behavior is controlled by envs `LOG_ENABLE` and `LOG_LEVEL`, e.g.:

```
LOG_LEVEL=info
LOG_ENABLE=route*
```

##### Change server logs settings in runtime

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

#### Client logs

On client side logs behavior can be changed by using `LOGGER_TOKEN` with the following methods - `logger.enable()` and `logger.setLevel()`

##### Change browser logs settings in runtime

`LOGGER_TOKEN` will be available in global variable - `window.logger`, so you can run the following code in browser console:

```js
logger.setLevel('info');
logger.enable('route*');
```

## How to

### How to see logs from the server in browser

This functionality is available only in dev-mode and can make development a little easier.

In browser console when loading page of the app the special log group with name `Tramvai SSR Logs` will be showed. If you open this group you will see logs from the server that was logged to this particular request. Herewith will be displayed only logs that are enabled for the [displaying on the server](#display-logs).

### How to see logs for the HTTP requests

:::info

Works only with [@tinkoff/request](https://tinkoff.github.io/tinkoff-request/)

:::

[http-client](references/modules/http-client.md) is already passes logger and its settings to the [log plugin](https://tinkoff.github.io/tinkoff-request/docs/plugins/log.html).

Plugin automatically generates names for loggers using template `request.${name}` that might be used to setting up [displaying of logs](#display-logs):

```tsx
const logger = di.get(LOGGER_TOKEN);
const makeRequest = request([...otherPlugins, logger({ name: 'my-api-name', logger })]);
```

As name of the logger equals to `my-api-name` to show logs:

- on server extend env `LOG_ENABLE: 'request.my-api-name'`
- on client call `logger.enable('request.my-api-name')`

### How to send logs to the API

:::info

It is implied that logs from the server are collected by the external tool that has access to the server console output and because of this logging to the external API from the server is not needed.

:::

For browser logs, you can send them to the API with [RemoteReporter](references/libs/logger.md#remotereporter).

For example, if we want to send logs with levels `error` and `fatal` to url declared in environment variable `FRONT_LOG_API`:

```ts
import { createToken, provide, Scope, APP_INFO_TOKEN } from '@tramvai/core';
import { ENV_USED_TOKEN, ENV_MANAGER_TOKEN, LOGGER_INIT_HOOK } from '@tramvai/tokens-common';
import { RemoteReporter } from '@tinkoff/logger';
import { isUrl } from '@tinkoff/env-validators';

const REMOTE_REPORTER = createToken<RemoteReporter>('remoteReporter');

const providers = [
  // provide new env variable with logs collector endpoint
  provide({
    provide: ENV_USED_TOKEN,
    useValue: [
      // use isUrl for validation
      { key: 'FRONT_LOG_API', dehydrate: true, validator: isUrl },
    ],
  }),
  // provide new remote reporter
  provide({
    provide: REMOTE_REPORTER,
    // we need only one instance of reporter
    scope: Scope.SINGLETON,
    useFactory: ({ appInfo, envManager, wuid }) => {
      const { appName } = appInfo;
      const logApi = envManager.get('FRONT_LOG_API');

      return new RemoteReporter({
        // number of parallel request
        requestCount: 1,
        // log levels which will be send to api
        emitLevels: { error: true, fatal: true },
        makeRequest(logObj) {
          return sendLog({
            logApi,
            // additional information for every reported logs
            payload: {
              ...logObj,
              appName,
              userAgent: window.navigator.userAgent,
              href: window.location.href,
            },
          });
        },
      });
    },
    deps: {
      appInfo: APP_INFO_TOKEN,
      envManager: ENV_MANAGER_TOKEN,
    },
  }),
  // add reporter to logger
  provide({
    provide: LOGGER_INIT_HOOK,
    multi: true,
    useFactory({ remoteReporter }) {
      return (loggerInstance) => {
        loggerInstance.addBeforeReporter(remoteReporter);
      };
    },
    deps: {
      remoteReporter: REMOTE_REPORTER,
    },
  }),
];
```

### How to properly format logs

See [@tinkoff/logger](references/libs/logger.md#how-to-log-properly) library documentation
