## О модуле

Модуль метрик предоставляет интерфейс, описанный в пакете `@platform/metrics-types`. На сервере при этом будет подключена реализация на оснонове публичного пакета `prom-client`, выставляющая метрики с `/metrics` в формате Prometheus.

Для подробной информации о типах метрик, их поведении и параметрах – см. [`prom-client`](https://github.com/siimon/prom-client).

## Как пользоваться

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

## Мониторинг исходящих запросов

Для того чтобы мониторить состояние исходящих запросов (количество запросов, количество ошибок, время выполнения) в модуле манкипатчатся методы request и get модулей http и https. Чтобы это заработало необходимо просто подключить модуль метрик в приложение.

В метрики попадают лейблы:

- http метод
- http код ответа
- имя сервиса

Метрики определяют имя сервиса сопоставляя урлы со значениями в MetricsServicesRegistry. Изначательно туда загружается инвертированное содержимое env, то есть если урл из env является подстрокой урла запроса, то ключ станет именем сервиса. Если совпадает несколько, то берётся самый длинный урл из env.

### Как сделать чтобы для запросов в метриках было имя сервиса вместо адреса хоста

Можно подсказать модулю метрик имя сервиса, если урл получается динамически. Для этого нужно:

- подключить модуль по токену `METRICS_SERVICES_REGISTRY_TOKEN`;
- вызвать `metricsServicesRegistry.register("Часть урла или весь урл", "Имя сервиса")`

## Использование метрик для профилирования перформанса на стороне браузера

Для измерения продолжительности события, необходимо использовать метод `startTimer` у классов Gauge, Histogram и Summary. В dev-режиме эти классы патчатся и методы работы с таймером использует [PerformanceApi](https://developer.mozilla.org/en-US/docs/Web/API/Performance).

## Пример использования

Без дополнительных полей

```
const metric = metrics.gauge({
    name: 'request_measure',
    help: 'Request duration measure',
});

const endTimer = metric.startTimer();

fetch(url).then(() => {
    endTimer();

    // выводим результат - performance.getEntriesByName('request_measure');
});
```

Добавляем динамические поля

```
const metric = metrics.gauge({
    name: 'request_measure',
    help: 'Request duration measure',
});

const endTimer = metric.startTimer({ method: 'GET' });

fetch(url).then(() => {
    endTimer({ status: 200 });

    // выводим результат - performance.getEntriesByName('request_measure{method="GET",status="200"}');
});
```

## Клиентские метрики

Модуль реализует в себе возможность собирать метрики с клиента и раздавать их прометеусам с помощью обычного серверного механизма через отправку метрик в papi-роуты.

Механика работы заключается в том что заводится counter и специальный папи-роут, дёрнув который по http мы можем инкрементировать этот counter.

В модуле уже реализован весь общий для таких случаев функционал. Чтобы создать метрику необходимо создать провайдер с токеном `REGISTER_INSTANT_METRIC_TOKEN`, провайдер должен возвращать список из двух сущностей где первая это slug papi-роута, а вторая это инстанс счётчика. Например:

```javascript
import { provide } from '@tramvai/core';

provide({
  provide: REGISTER_INSTANT_METRIC_TOKEN,
  multi: true,
  deps: {
    metrics: METRICS_MODULE_TOKEN,
  },
  useFactory({ metrics }) {
    return [
      'page-load',
      new Counter({ name: 'client_page_load_total', help: 'Загрузки страниц у клиентов' }),
    ];
  },
});
```

Теперь для того чтобы инкрементировать метрику `client_page_load_total` достаточно дёрнуть papi-роут `/metrics/page-load`.

#### instantMetricsReporter

На практике выяснилось что часто помимо сбора метрик необходимо отправить логи с подробностями. Эту потребность реализует instantMetricsReporter. При вызове логгера он проверяет наличие метрик со slug аналогичным полю event в логах и если такие метрики существуют, то отправляет запрос на соответствующий papi-роут.

Таким образом можно одновременно залогировать событие и инкрементировать серверную метрику.

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

## Отладка

Модуль использует логгеры с идентификаторами: `metrics:perf`, `metrics:papi`

## Экспортируемые токены

[ссылка](references/tokens/metrics-tokens.md)
