# @tinkoff/measure-express-requests

Library for measuring RED metrics in the express app

## Example

```ts
import express from 'express';
import { measure } from '@tinkoff/measure-express-requests';
import { Counter, Histogram } from 'prom-client';

const app = express();

app.use(
  measure({
    metrics: {
      counter: (opt) => new Counter(opt),
      histogram: (opt) => new Histogram(opt),
    },
  })
);
```

In the prom-client registry new metrics will be available:

- `http_requests_total` - number of incoming requests;
- `http_requests_errors` - number of errors in the incoming requests;
- `http_requests_execution_time` - histogram with the request handler execution time.
