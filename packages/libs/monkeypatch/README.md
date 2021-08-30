# @tinkoff/monkeypatch

Утилита для манкипатчинга, подменяет реализацию метода на заданную, и при вызове передаёт оригинальынй метод в первый аргумент новой реализации.

## API

### monkeypatch

```
import monkeypatch from '@tinkoff/monkeypatch';
import http from 'http';

cosnt handler = function(request, ...args) {
  console.log('request with args:', args);

  return request(...args);
}

monkeypatch({ obj: http, method: 'request', handler })
```
