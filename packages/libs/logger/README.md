# Logger

Logging library

## Installation

Install using package manager, e.g. for npm:

```bash
npm i --save @tinkoff/logger
```

for yarn:

```bash
yarn add @tinkoff/logger
```

## Api

### Child loggers

You can create child loggers using method `.child` of the current logger instance. Child logger will inherit parent logger settings and can override these settings.

```tsx
const log = logger({ name: 'test' });

const childLog = log.child('child'); // as this logger is child logger the result name will be 'test.child'

const childLogWithDefaults = log.child({
  name: 'withDefaults',
  defaults: {
    // defaults might be used to specify properties which will be merged to log objects logged with this logger
    child: true,
  },
});

const childLogWithOverrides = log.child({
  name: 'override',
  reporters: [], // may override settings of the parent logger
  filters: [],
  extensions: [],
});
```

### Display logs

Library allows to specify used logging level, show/hide logs for specific instances of the logger, reset display settings.

By default, `error` level is used for every logger.

Settings display level higher than `error` for single logger, e.g. `logger.enable('info', 'my-logger')`, overrides logging level only for `my-logger`.

It is impossible to set logging level lower than common level, e.g. when using common logging level equal to `error` calls to `logger.enable('fatal', 'my-logger')` changes nothing.

All subsequent setup for log displaying are preserved, e.g. subsequent calls `logger.enable('info', 'my-logger')` and `logger.enable('trace', 'yet-another-logger')` will enable logs to both logger according to their settings.

#### Display logs on server

For control of displaying logs on server environment variables `LOG_LEVEL` and `LOG_ENABLE` are used:

- LOG_LEVEL = trace | debug | info | warn | error | fatal - enables displaying logs for specified level and higher. E.g.:
  - if `LOG_LEVEL=info` then all logs of levels info, warn, error, fatal will be showed.
- LOG_ENABLE = `${name}` | `${level}:${name}` - let to enable displaying logs for a specific name and level. It can accept several entries that are passed as comma-separated. E.g.:
  - if `LOG_ENABLE=server` then all logs for name `server` will be displayed
  - if `LOG_ENABLE=trace:server*` then for logs with name server only `trace` level will be showed
  - if `LOG_ENABLE=info:server,client,trace:shared` then displaying logs will be enabled for specified loggers using rules above

#### Display logs in browser

In browser display settings are stored in localStorage, so it will work even after page reloads. In order to reset settings you may clear localStorage. For convenient usage a special object `logger` is added to window object in the browser.

```tsx
logger === window.logger;

logger.setLevel('warn'); // enable displaying log for level `warn` and higher

logger.enable('info', 'test'); // enable displaying logs for logger `test` with level `info` также отображать вывод логгера test уровня info

logger.enable('my-logger'); // show all logs for logger `my-logger`

logger.enable('perf*'); // enable all logs with name starting with `perf`

logger.disable('my-logger'); // disable displaying logs for `my-logger`

logger.clear(); // reset all settings
```

### Configuration

#### Local logger configuration

```javascript
import { logger } from '@tinkoff/logger';

const log = logger({ name: 'my-logger' }); // name is required field in order to identify logs
const log = logger('my-logger'); // same as above

const log = logger({
  name: 'remote-logger',
  defaults: {
    remote: true,
  },
});
```

Options:

- `name[='log']` - name of the new logger

### Extend logger functionality

`@tinkoff/logger` might be extended using next entities:

#### Filter

Filters can disable logging for specific logs base on inner conditions

```tsx
import { logger } from '@tinkoff/logger';

interface Filter {
  filter(logObj: LogObj): boolean;
}

logger.addFilter(filter as Filter); // add new filter to list of previously added filters
logger.setFilters([filter1, filter2]); // replace current filters with passed list. that allows to override default settings
```

#### Extension

Extensions can extend or override log object before making actual logging

```tsx
import { logger } from '@tinkoff/logger';

interface Extension {
  extend(logObj: LogObj): LogObj;
}

logger.addExtension(extension as Extension); // add new extension to list of previously added extensions
logger.setExtensions([extension1, extension2]); // replace current extensions with passed list. that allows to override default settings
```

#### Reporter

Reporters can change the way logs are showed (json, fancy logs in browser, send logs to remote api).

Be default, enabled only reporters for displaying logs in console based on [display logs settings](#display-logs)

Reporters are depends of logger level settings as reporters will not be called if level of the current log are lower than display logs setting

```tsx
import { logger } from '@tinkoff/logger';

interface Reporter {
  log(logObj: LogObj): void;
}

logger.addReporter(reporter as Reporter); // add new reporter to list of previously added reporters
logger.setReporters([reporter1, reporter2]); // replace current reporters with passed list. that allows to override default settings
```

#### BeforeReporter

Same as usual `Reporter` but `BeforeReporter` are called unconditionally for every log and get called before any other extension.

```tsx
import { logger } from '@tinkoff/logger';

interface Reporter {
  log(logObj: LogObj): void;
}

logger.addBeforeReporter(reporter as Reporter); // add new beforeReporter to list of previously added beforeReporter
logger.setBeforeReporters([reporter1, reporter2]); // replace current beforeReporters with passed list. that allows to override default settings
```

### Bundled Reporters

#### BrowserReporter

Standard reporter to show logs in browser

#### NodeDevReporter

Standard reporter to showing logs in the server console with handy formatting

Used by default in dev-mode or if environment variable `process.env.DEBUG_PLAIN` is specified.

#### NodeBasicReporter

Minimal reporter to showing logs in the server console.

#### JSONReporter

Show logs in json format.

#### RemoteReporter

Sends logs on remote api.

```tsx
import { logger, RemoteReporter } from '@tinkoff/logger';

const remote = new RemoteReporter({
  requestCount: 1, // number of parallel request
  emitLevels: { error: true, fatal: true }, // log levels which will be send to api
  async makeRequest(logObj) {
    // function that accepts log object and sends data to api
    return await request();
  },
});

logger.addReporter(remote);

const log = logger({ name: 'test-remote' }); // settings for remote will be inherited from RemoteReporter itself

log.error('error'); // will be sent to api
log.info('test'); // will not be sent to api

const remoteLog = logger({ name: 'remote-for-all', remote: true }); // `remote` allows to override settings from RemoteReporter and send logs unconditionally

remoteLog.info('test'); // will be sent to api
remoteLog.debug('test'); // will be sent to api

const traceLog = logger({ name: 'log-trace', emitLevels: { trace: true } }); // override RemoteReporter settings

traceLog.trace('test'); // will be sent to api
traceLog.error('test'); // will not be sent to api
```

## How to

### Base usage

```javascript
import logger from '@tinkoff/logger'; // import logger

const log = logger('my-component'); // create new logger with an id `my-component`. This id will be added for every log at field `name`. Using unique ids will help to find source of the logs

// logs can be created with different levels
log.trace('trace');
log.debug('debug');
log.info({ event: 'client-visited', message: 'client visited tinkoff.ru' });
log.warn('warn');
log.error({ event: 'form-send-error', error: new Error('form') });
log.fatal('fatal error');
```

More about logging level and what do they mean in [the article](https://www.scalyr.com/blog/logging-levels/).

## How to log properly

To log properly it is suitable to use next format:

```tsx
interface Log {
  event?: string; // unique id of event which is might be easily found in log management tool
  message?: string; // log description
  error?: Error; // error if appropriate
  [key]: any; // any other data
}
```

- In case of logging simple text just use string template to pass result string to logger. For json format this string will be available in the `message` props.

```tsx
logger.info('hello logger'); // identical to logger.info({ message: 'hello logger' });
```

- In order to log some object or many arguments, compile they together to single object:

```tsx
logger.warn({
  message: 'be warn',
  event: 'my-warning',
  ...obj1,
  ...obj2,
  a: 1,
  b: 2,
});
```

- In order to log error object either pass the error with the props `error` or pass it to logger as only argument

```tsx
logger.error({
  error: new Error('message'),
});

logger.error(new Error('message'));
logger.error(new Error('typeError'), 'custom error message'); // a special format to redefine error message
```

- In case of several arguments were passed to logger then only the first argument will be proceeded with the rules from above while all of the other arguments will be passed as an `args` props

```tsx
logger.debug(
  {
    event: 'watch',
    data: 'some data',
  },
  'arg2',
  'arg3'
);
```

These formatting rules are handful to connect logging to external tools like kibana, splunk. So it is desirable to follow these rules, otherwise it may lead to troubles with searching and analyzing your logs.

## Troubleshooting

### I use logger in my Nest.js application, and it does not work

Be sure that you set all required environment variable (`LOG_LEVEL` and `LOG_ENABLE`) before app initialization. If you set all variable in `.env` and parse them via Nest.js's [ConfigModule](https://docs.nestjs.com/techniques/configuration), they will not be available in the [logger initialization phase](https://github.com/Tinkoff/tramvai/blob/main/packages/libs/logger/src/server.ts#L13-L14). `ConfigModule` parses `.env`-file later.

Also, check [here](https://github.com/Tinkoff/tramvai/blob/main/packages/libs/logger/src/server.ts#L34) that `DEBUG_PLAIN` or `NODE_ENV` variables are available.
