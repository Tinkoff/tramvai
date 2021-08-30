# Tramvai test integration

Библиотека хелперов для интеграционного тестирования приложений. Подразумевается полноценный старт всего приложения со сборкой с помощью `@tramvai/cli` и использования хелперов для анализа результата запросов на сервер и проверки рендера приложения в браузере

## Подключение

```bash
npm i --save-dev @tramvai/test-integration
```

## How To

### Тестирование запросов к `tramvai` приложению без запуска в браузере (aka `curl`)

Для тестирования полноценных запросов к `tramvai` приложению используется библиотеки [superagent](https://github.com/visionmedia/superagent) и [node-html-parser](https://github.com/taoqf/node-html-parser)

При вызове метода `app.request` отправляются запросы в приложение, и доступны все возможности `superagent`.

При вызове метода `app.render` можно получить доступ к HTML разметке, которую вернул запрос в приложение.

```ts
import { startCli } from '@tramvai/test-integration';
import { initPuppeteer, wrapPuppeteerPage } from '@tramvai/test-puppeteer';

beforeAll(async () => {
  app = await startCli('bootstrap', {
    env: {
      SOME_ENV: 'test',
    },
  });
}, 80000);

afterAll(() => {
  return app.close();
});

it('request to main page return status 200', async () => {
  return app.request('/').expect(200);
});

it('main page HTML snapshot', async () => {
  const parsed = await app.render('/');
  const applicationInnerHtml = parsed.application;

  expect(parsed.application).toMatchInlineSnapshot();
});
```


### Тестирование приложения в браузере с помощью `Puppeteer`

Для запуска полноценных браузерных тестов можно использовать библиотеку [@tramvai/test-puppeteer](references/test/test-puppeteer.md)

### Использование @tinkoff/mocker в тестах

Для использования мокера в интеграционных тестах необходимо добавить модуль [`@tramvai/module-mocker`](references/modules/mocker.md) в список модулей для приложения

Затем мокер подтянет файловые моки как описано в доке к самому мокеру и есть возможность добавлять моки динамически в тестах:

```ts
it('should work with mocker', async () => {
  await app.mocker.addMocks('CONFIG_API', {
    'GET /test/': {
      status: 200,
      payload: {
        status: 'OK',
        response: 'smth',
      },
    },
  });

  await app.request('/api/').expect(200);

  await app.papi.clearCache();
  await app.mocker.removeMocks('CONFIG_API', ['GET /test/']);

  await app.request('/api/').expect(500);
});
```
