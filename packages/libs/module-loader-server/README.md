# module-loader-server

Загрузчик модулей для серверного окружения. Загружает файл по урлу, компилирует и выполняет модуль с помощью модуля [vm](https://nodejs.org/dist/latest-v12.x/docs/api/vm.html), кэширует результат.

## Установка

Для yarn:

```shell script
yarn add @tinkoff/module-loader-server
```

Для npm:

```shell script
npm install @tinkoff/module-loader-server
```

## Подключение и использование

```javascript
import { ServerLoader } from '@tinkoff/module-loader-server';

const loader = new ServerLoader();

loader.resolveByUrl('https://cdn.example.com/js/module.js').then((moduleExports) => {
  // ...
});
```

В конструктор можно передать опции (см. интерфейс `LoaderDeps`), из важных это параметр `request` который по умлочанию определяется библиотекой [request](https://tinkoff.github.io/tinkoff-request/), и содержит только [deduplicate](https://tinkoff.github.io/tinkoff-request/docs/plugins/cache-deduplicate.html) плагин.

Если вам нужны другие плагины или поведение при запросе на сервер, переопределите параметр `request` в конструкторе лоадера.

### Взаимодействие с кешем

Допустим вам нужно сихронное апи для получения объекта, при условии что он есть в кэше. Тогда есть два способа.

Первый, используем метод `loadByUrl<R>(url: string, options: LoadOptions)`, который возвращает `Promise<R>` если объекта нет в кеше, и `R` если он там есть:

```tsx
const result = loader.loadByUrl(url);
if (!isPromise(result)) {
  syncOperation(result);
} else {
  asyncOperation(result);
}
```

Второй, можно использовать метод `getByUrl<R = any>(url: string, options: LoadOptions = {}): R | void`, который возвращает объект, только если он присутствует в кеше:

```tsx
const result = loader.getByUrl(url);
if (result !== void 0) {
  syncOperation(result);
} else {
  asyncOperation(loader.resolveByUrl(url));
}
```

## Интерфейс и типы

@inline src/types.h.ts
