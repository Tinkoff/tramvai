# @tinkoff/measure-fastify-requests

Library for measuring RED metrics in the fastify app

## Example

```ts
import fastify from 'fastify';
import { fastifyMeasureRequests } from '@tinkoff/measure-fastify-requests';
import { Counter, Histogram } from 'prom-client';

const app = fastify();

app.register(fastifyMeasureRequests, {
  metrics: {
    counter: (opt) => new Counter(opt),
    histogram: (opt) => new Histogram(opt),
  },
});
```

In the prom-client registry new metrics will be available:

- `http_requests_total` - number of incoming requests;
- `http_requests_errors` - number of errors in the incoming requests;
- `http_requests_execution_time` - histogram with the request handler execution time.
