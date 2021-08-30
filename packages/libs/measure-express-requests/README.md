# @tinkoff/measure-express-requests

Библиотека для замера RED метрик в express приложениях

## Пример использования

```
import express from 'express';
import { measure } from '@tinkoff/measure-express-requests';
import { Counter, Histogram } from 'prom-client';

const app = express();

app.use(measure({
  metrics: {
    counter: (opt) => new Counter(opt),
    histogram: (opt) => new Histogram(opt),
  }
}))
```

В результате в registry из prom-client будут собираться метрики:

- `http_requests_total` - счётчик входящих вопросов;
- `http_requests_errors` - счётчик ошибок во входящих запросах;
- `http_requests_execution_time` - гистограмма с измерениями времени выполнения входящих запросов.
