# @tinkoff/mocker

Сервер и middleware для мокирования API.

## Подключение

Необходимо установить `@tinkoff/mocker`:

```bash
yarn add @tinkoff/mocker
```

Создать первый мок, в файле `mocks/first-api.js`:

```tsx
module.exports = {
  api: 'first-api',
  mocks: {
    'GET /endpoint': {
      status: 200,
      headers: {},
      payload: 'mocked response',
    },
  },
};
```

Затем подключить мокер в проекте:

```tsx
import { Mocker, FileSystemMockRepository } from '@tinkoff/mocker';

// репозиторий будет читать моки из файлов в текущей директории, из папки `mocks`
const repository = new FileSystemMockRepository({ cwd: process.cwd(), root: 'mocks' });
// все запросы к мокеру на `/first-api/...` либо получают подходящий мок, либо проксируются на оригинальное API
const options = {
  apis: {
    'first-api': {
      target: 'https://real-first-api.com/',
    },
  },
  passUnhandledRequests: true
};

const mocker = new Mocker({ options, repository, logger: console });

(async () => {
  // на этом этапе мокер загружает моки через репозиторий, и создает соответствующие роуты
  await mocker.init();

  mocker.start(4000, () => {
    console.log('Mocker running at 4000 port');
  });
})();
```

И можем отправить `GET` запрос к мокеру:

```tsx
(async () => {
const response = await fetch('http://localhost:4000/first-api/endpoint');
const data = await response.json();

console.log(data); // "mocked response"
})();
```

## Explanation

Библиотека работает на основе [express](https://expressjs.com/), `mocker` можно использовать как в качестве самостоятельного сервера,
так и на существующем сервере через middleware `mocker.use(req, res)`.

`FileSystemMockRepository` поддерживает моки в форматах `js` и `json`, `js` моки позволяют задавать кастомные `express` обработчики (методы) в качестве мока.

При выбора мока для текущего запроса, учитывается `method` запроса, `url` и `query` параметры.

Мокер поддерживает проксирование запросов в API, что позволяет мокировать только некоторые эндпоинты, а не весь бэкенд.

### Маршрутизация

Если мокер был запущен как отдельный сервер, например на 4000 порту, он будет доступен на `http://localhost:4000/`.

Для каждого `api` из настроек `options.apis` будет создан вложенный роутер, для `first-api` это будет `http://localhost:4000/first-api/`.

Роуты для `api` создаются на основе моков, у которых ключем является метод + урл запроса, например мок `GET /endpoint` будет доступен по адресу `http://localhost:4000/first-api/endpoint`, для `GET` запросов.

### Моки из файловой системы

Мокер получает моки через репозиторий, что позволяет хранить моки в файловой системе, памяти, или на другом сервере.
`FileSystemMockRepository` работает с файловой системой, и поддерживает следующие виды моков:

**mock.json**
```json
{
  "api": "first-api",
  "mocks": {
    "GET /foo": {
      "status": 200,
      "headers": {},
      "payload": {
        "fake": "true"
      }
    }
  }
}
```

**mock.js**
```tsx
module.exports = {
  api: 'first-api',
  mocks: {
    'GET /bar': {
      status: 200,
      headers: {},
      payload: {
        fake: 'true',
      },
    },
    'POST /bar': (req, res) => {
      res.status(200);
      res.set('X-Mock-Server', 'true');
      res.json({ fake: 'true' });
    },
  },
};
```

## API

### Mocker

```tsx
interface Mocker {
  new (params: {
    options: MockerOptions;
    repository: MockRepository;
    logger: Logger;
  }): Mocker;

  init(): Promise<void>;

  update(): Promise<void>;

  use(req: IncomingMessage, res: ServerResponse): express.Express;

  start(port: number, callback?: (...args: any[]) => void): Server;
}
```

`Mocker.init` - получение моков через `MockRepository`, инициализация роутинга. Необходимо вызывать до запуска сервера или middleware.

`Mocker.update` - получение моков через `MockRepository`, обновление роутинга. Можно вызывать в рантайме.

`Mocker.use` - `express` middleware, подходит для запуска на существующем сервере.

`Mocker.start` - запуск мокера на стандартном http сервере.

### MockerOptions

```tsx
interface MockerOptions {
  apis: Record<string, { target: string }>;
  passUnhandledRequests?: boolean;
  apiRoutePrefix?: string;
}
```

`MockerOptions.apis` - список API для мокирования, в `target` указывается оригинальный урл API.

`MockerOptions.passUnhandledRequests` - при включенной опции, все запросы, для которых не нашлось моков, проксируются на `target` url,
иначе отдается ошибка.

`MockerOptions.apiRoutePrefix` - если мокер запускается в существующем приложении на вложенном роуте, например `/mocker`,
может понадобиться пробросить этот урл в `apiRoutePrefix` для корректной работы роутера мокера.

### MockRepository

```tsx
interface MockRepository {
  get(api: string, endpoint: string): Promise<Mock>;

  getAll(api: string): Promise<Record<string, Mock>>;

  add(api: string, endpoint: string, mock: Mock): Promise<void>;

  delete(api: string, endpoint: string): Promise<void>;
}
```

`MockRepository.getAll` - получить все моки для указанного api.

`MockRepository.get` - получить конкретный мок для указанного api.

`MockRepository.add` - добавить мок для указанного api.

`MockRepository.delete` - удалить конкретный мок для указанного api.

## How to

### Как мокать запрос только с определенными query параметрами?

В моках реализованна поддержка сверки query параметров запроса и мока,
в примере ниже запрос на `/endpoint?foo=bar` попадет в первый мок, `/endpoint?foo=baz` во второй,
а все остальные запросы с другими query, или без них, проксируются в оригинальное API (при включенной опции `passUnhandledRequests`).

```tsx
module.exports = {
  api: 'api',
  mocks: {
    'GET /endpoint?foo=bar': {
      status: 200,
      headers: {},
      payload: 'mocked bar response',
    },
    'GET /endpoint?foo=baz': {
      status: 200,
      headers: {},
      payload: 'mocked baz response',
    },
  },
};
```

### Как проксировать в оригинальное API определенный запрос?

Это имеет смысл, если отключена опция `passUnhandledRequests`, достаточно передать свойство `pass: true` в нужный мок:

```tsx
module.exports = {
  api: 'api',
  mocks: {
    'ALL /endpoint': {
      pass: true,
    },
  },
};
```
