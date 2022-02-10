# @tramvai/module-metrics

Module provides the interface described in `@platform/metrics-types`. On server the interface is implemented with public package `prom-client` that provides metrics on url `/metrics` Prometheus format.

More details about metrics type, parameters and how to use it see in [docs to `prom-client`](https://github.com/siimon/prom-client).

## Explanation

### Monitoring outgoing requests

To monitor the state of the outgoing requests (like number of requests, number of error, time execution) the module monkey-patches `request` and `get` methods of the standard modules `http` and `https`. To make it work just add metrics module to the app.

Next labels are added to metrics:

- http method
- http response code
- service name

Name of the service calculates by comparing request urls with values in `MetricsServicesRegistry`. Initially the register is bootstrapped with the inverted content of env variables, e.g. if some url from env is a substring of the request url, then the name of the env become the service name. If several envs matches this logic then the env with the longest url is used.

### Client metrics

Module implements feature to collect metrics from the clients and share it with Prometheus by sending metrics from the client to server papi-route.

Metrics module can help in implementing this functionality in common cases. To create metric register provider for the token `REGISTER_INSTANT_METRIC_TOKEN`. Your provider should return list of two entities - first is a slug of papi-route and second is an instance of Counter. E.g.:

```javascript
import { provide } from '@tramvai/core';

provide({
  provide: REGISTER_INSTANT_METRIC_TOKEN,
  multi: true,
  deps: {
    metrics: METRICS_MODULE_TOKEN,
  },
  useFactory({ metrics }) {
    return ['page-load', new Counter({ name: 'client_page_load_total', help: 'Client page load' })];
  },
});
```

After that to increment metric `client_page_load_total` you can call papi-route `/metrics/page-load`.

#### instantMetricsReporter

In practice it become clear that besides metric collection it often needed to collect logs with details. This can be implemented with `instantMetricsReporter`. When calling logger module will check that any metric with the slug equal to the event of the log is exist. If so module will send request to the corresponding papi-route.

Next way you can log event and increment server metric:

```javascript
import { provide } from '@tramvai/core';
provide({
  provide: commandLineListTokens.init,
  multi: true,
  deps: {
    logger: LOGGER_TOKEN,
  },
  useFactory({ logger }) {
    return () => {
      window.on('load', () => {
        logger.info({ event: 'page-load' });
      })
    };
  },
}),
```

## How to

### Usage Example

```tsx
import { createToken } from '@tinkoff/dippy';
import { Module, provide } from '@tramvai/core';
import { Counter, Metrics, METRICS_MODULE_TOKEN } from '@tramvai/tokens-metrics';

interface SomeModuleOptions {
  metrics: Metrics;
}

class SomeModule {
  private metricActionCounter: Counter;

  constructor(options: SomeModuleOptions) {
    this.metricActionCounter = options.metrics.counter({
      name: 'some_actions_total',
      help: 'Total count of some actions',
    });
  }

  public action(): void {
    this.metricActionCounter.inc();

    // Do some meaningful action
  }
}

export const SOME_MODULE = createToken<SomeModule>('someModule');

@Module({
  providers: [
    provide({
      provide: SOME_MODULE,
      useFactory: (deps) => new SomeModule(deps),
      deps: {
        metrics: METRICS_MODULE_TOKEN,
      },
    }),
  ],
})
export class SomeModuleContainer {}
```

### Make service names showed in metrics instead of hostnames

It is possible to give a hint to module about the service name in case url is dynamic. To do that:

- use token `METRICS_SERVICES_REGISTRY_TOKEN`;
- call `metricsServicesRegistry.register("Part of the url or the whole url", "Name of service")`

### Use metrics to profile performance in browser

To measure length of the events you must use method `startTimer` of classes Gauge, Histogram, Summary. In dev-mode these classes are patched and methods to work with timers will use [PerformanceApi](https://developer.mozilla.org/en-US/docs/Web/API/Performance).

Example without additional fields:

```ts
const metric = metrics.gauge({
  name: 'request_measure',
  help: 'Request duration measure',
});

const endTimer = metric.startTimer();

fetch(url).then(() => {
  endTimer();

  // output the result - performance.getEntriesByName('request_measure');
});
```

Example with adding dynamic fields:

```ts
const metric = metrics.gauge({
  name: 'request_measure',
  help: 'Request duration measure',
});

const endTimer = metric.startTimer({ method: 'GET' });

fetch(url).then(() => {
  endTimer({ status: 200 });

  // output the result - performance.getEntriesByName('request_measure{method="GET",status="200"}');
});
```

## Debug

The module uses loggers with the next ids: `metrics:perf`, `metrics:papi`

## Exported tokens

[link](references/tokens/metrics.md)
