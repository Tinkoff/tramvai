# @tinkoff/mocker

A server and a middleware for API mocking.

## Installation

Install `@tinkoff/mocker`:

```bash npm2yarn
npm install @tinkoff/mocker
```

Add your first mock to file `mocks/first-api.js`:

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

Set up mocker in your project:

```tsx
import { Mocker, FileSystemMockRepository } from '@tinkoff/mocker';

// Repository will read mocks from directory `mocks` relative from current dir
const repository = new FileSystemMockRepository({ cwd: process.cwd(), root: 'mocks' });
// Mocker to all of the request on `/first-api/...` will response with mock found in fs or with proxying request to the source API
const options = {
  apis: {
    'first-api': {
      target: 'https://real-first-api.com/',
    },
  },
  passUnhandledRequests: true,
};

const mocker = new Mocker({ repositories: [repository], logger: console, ...options });

(async () => {
  // with this call mocker reads mocks from repository and creates according routes
  await mocker.init();

  mocker.start(4000, () => {
    console.log('Mocker is running at 4000 port');
  });
})();
```

Now we can make a `GET` request to mocker

```tsx
(async () => {
  const response = await fetch('http://localhost:4000/first-api/endpoint');
  const data = await response.json();

  console.log(data); // "mocked response"
})();
```

## Explanation

Library is based on [express](https://expressjs.com/).

`mocker` can be used as standalone server or as a middleware for existing server through call `mocker.use(req, res)`.

`FileSystemMockRepository` supports mock in `js` и `json` formats. `js` mocks are able to define custom `express` handler as a mock handler.

For choosing right mock for request next parameters of the request are considered: `method`, `url` and `query`.

Mocker supports proxying requests to API that allows to mock only part of the API and not a whole backend

### Routing

If mocker is running as a standalone server, for example on 4000 port, then it will be accessible at url `http://localhost:4000/`.

For every api from settings `options.apis` will be created a nester router, e.g. for `first-api` it will be `http://localhost:4000/first-api/`.

Routes for `api` are getting created based on mocks, in which key is a method + url of the request, e.g. mock `GET /endpoint` will be accessible at `http://localhost:4000/first-api/endpoint` for `GET` requests.

### FileSystem mocks

Mocker reads mocks using Repository, that allows to store mocks in FileSystem or on the another server.

`FileSystemMockRepository` works with FileSystem and supports next kinds of mocks:

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
  new (params: { options: MockerOptions; repository: MockRepository; logger: Logger }): Mocker;

  init(): Promise<void>;

  update(): Promise<void>;

  use(req: IncomingMessage, res: ServerResponse): express.Express;

  start(port: number, callback?: (...args: any[]) => void): Server;
}
```

`Mocker.init` - resolve mocks using `MockRepository`, routing initialization. Must be called before using server with mocks.

`Mocker.update` - updating mocks using `MockRepository`, routing update. Might be called in runtime.

`Mocker.use` - `express` middleware. Might be used for adding mocker on the existing server.

`Mocker.start` - run mocker as a standalone http-server.

### MockerOptions

```tsx
interface MockerOptions {
  apis: Record<string, { target: string }>;
  passUnhandledRequests?: boolean;
  apiRoutePrefix?: string;
}
```

`MockerOptions.apis` - list of APIs for mocking, key `target` points to the source API.

`MockerOptions.passUnhandledRequests` - when enabled, all of the request without according mock will be proxied to the `target`, otherwise fail the request.

`MockerOptions.apiRoutePrefix` - if mocker is used in existing server on nested route, e.g. `/mocker`, this option might be used to pass this route as `apiRoutePrefix` for proper routing.

### MockRepository

```tsx
interface MockRepository {
  get(api: string, endpoint: string): Promise<Mock>;

  getAll(api: string): Promise<Record<string, Mock>>;

  add(api: string, endpoint: string, mock: Mock): Promise<void>;

  delete(api: string, endpoint: string): Promise<void>;
}
```

`MockRepository.getAll` - get all mocks for specified API.

`MockRepository.get` - get specific mock for specific API.

`MockRepository.add` - add new mock for specific API.

`MockRepository.delete` - remove specific mock for specific API.

## How to

### How to mock request with specific query parameters?

Mocker allows to specify query parameters for mocks.

In the example below request to `/endpoint?foo=bar` will be mocked with first mock, and request to `/endpoint?foo=baz` will be mocked with second. All of the other requests with\without query will be proxied to source API (if `passUnhandledRequests` is enabled).

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

### How to proxy specific request to source API?

It might be useful if option `passUnhandledRequests` is disabled. In that case you may pass option `pass: true` to mock:

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
