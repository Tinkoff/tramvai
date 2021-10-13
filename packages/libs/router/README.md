# @tinkoff/router

Библиотека роутинга. Может работать как на сервере, так и на клиенте. Предназначена прежде всего для построения изморфных приложений.

## Подключение

Необходимо установить `@tinkoff/router`

```bash
yarn add @tinkoff/router
```

И подключить в проекте

```tsx
import { Router } from '@tinkoff/router';

const router = new Router();
```

## Explanation

Основные функции:

- Библиотека поддерживает варианты работы как на сервере, так и на клиенте.
- Есть возможность использовать ралзичные варианты клиентского перехода: со спа-переходами или без.
- Для проверки доступности роута при конкретных условиях есть Guards.
- Можно подписываться на разные этапы перехода через хуки
- Компоненты и хуки для простой работы с роутингом из реакт

### Версия для сервера и клиента

Достачно просто импортировать роутинг из самой библиотеки и уже на основании настроек в package.json вернётся необходимая версия для сервера или клиента

```ts
import { Router } from '@tinkoff/router';
```

### Клиентский роутинг с\без спа-переходов

По умолчанию на клиенте эскпортируется роутинг с включенными спа-переходами. Если необходимо спа-переходы отключить, то нужно импортировать специальную версию роутинга

```ts
import { Router, SpaHistory } from '@tinkoff/router';
import { NoSpaRouter } from '@tinkoff/router';

const spaRouter = new Router({ history: new SpaHistory() });
const noSpaRouter = new NoSpaRouter();
```

### Router Guards

Гуарды позволяют контроллировать доступность того или иного роута для конретного перехода. Из гуарда можно заблокировать переход или иницировать редирект.

```ts
import { NavigationGuard } from '@tinkoff/router';

export const myGuard: NavigationGuard = async ({ to }) => {
  if (to.config.blocked) {
    return false; // заблокировать данный переход
  }

  if (to.config.redirect) {
    return '/login/'; // вызвать редирект на указанную страницу
  }

  // если ничего не вернуть переход будет совершен как обычно
};
```

### Хуки переходов

Хуки перехода позволяют выполнить свои асинхронные действия на разные этапы перехода.

```ts
import { NavigationHook } from '@tinkoff/router';

export const myHook: NavigationHook = async ({ from, to, url, fromUrl }) => {
  console.log(`navigating from ${from} to route ${to}`);
};
```

## API

### Получение данных о текущем роуте или урле

```ts
router.getCurrentRoute(); // вернет текущий роут
router.getCurrentUrl(); // вернёт распаршенную версию урла текущей страницы
```

### Иницилизация перехода

Есть два метода для иницилизации перехода и обновления адресной строки в браузере. Главное отличие этих двух методов, что один из них должен запускать полноценный переход с обновлением данных и запуском тяжеловесных действий по загрузке данных. Второй же метод служит в основном для обновления состояния для текущего роута: чтобы обновить query-параметры на странице или изменить динамические параметры самого роута.

#### navigate

Инициирует полноценный переход, с определением следующего роута и обновлением состояния в браузере.

```ts
router.navigate('/test');
router.navigate({ url: './test', query: { a: '1' } });
```

Хуки перехода:

- beforeResolve
- beforeNavigate
- afterNavigate

#### updateCurrentRoute

Переход основывается на текущем роуте (поэтому этот метод нельзя вызывать на сервере) и позволяет просто обновить некоторые данные для текущей страницы

```ts
router.updateCurrentRoute({ params: { id: 'abc' } });
router.updateCurrentRoute({ query: { a: '1' } });
```

Хуки:

- beforeUpdateCurrent
- afterUpdateCurrent

### Работа с query

#### Опция query

Позволяет задать search-строку для урла в виде объекта через опцию `query` при переходе. Предыдущее значение query при этом будет очищено

```ts
router.getCurrentUrl().query; // { с: 'c' }

router.navigate({ query: { a: 'a', b: 'b' } });
router.updateCurrentRoute({ query: { a: 'a', b: 'b' } });

router.getCurrentUrl().query; // { a: 'a', b: 'b' }
```

#### preserveQuery

Позволяет сохранить значение query от текущей навигации и использовать их в новом переходе

```ts
router.getCurrentUrl().query; // { с: 'c' }

router.navigate({ query: { a: 'a' }, preserveQuery: true });
router.updateCurrentRoute({ query: { a: 'a' }, preserveQuery: true });

router.getCurrentUrl().query; // { a: 'a', c: 'c' }
```

Если в качестве значения для конкретного ключа query передать undefined, то это значение очистится в новом query:

```ts
router.getCurrentUrl().query; // { a: 'a', b: 'b' }

router.navigate({ query: { a: undefined, c: 'c' }, preserveQuery: true });
router.updateCurrentRoute({ query: { a: undefined, c: 'c' }, preserveQuery: true });

router.getCurrentUrl().query; // { b: 'b', c: 'c' }
```

### Интеграция с React

Если несколько полезных React-хуков и компонентов для работы с роутингом

#### useRoute

Позволяет получить текущий активный роут приложения

```ts
import React from 'react';
import { useRoute } from '@tinkoff/router';

export const Component = () => {
  const route = useRoute();

  return <div>Route path: {route.actualPath}</div>;
};
```

#### useUrl

Позволяет получить текущий активный URL приложения

```ts
import React from 'react';
import { useUrl } from '@tinkoff/router';

export const Component = () => {
  const url = useUrl();

  return <div>Url query: {JSON.stringify(url.query)}</div>;
};
```

#### useNavigate

Создаёт колбек с вызовом навигации, который можно передать в дочерние компоненты или повесить как обработчик событий

```ts
export const Cmp = () => {
  const navigate = useNavigate('/test/');

  return <div onClick={navigate}>Test</div>;
};
```

#### Link

Обёртка для реакт-компонента, которая делает его кликабельным

> Если в качестве children передать в Link реакт-компонент, то будет отрендерен этот переданный компонент и в него будут переданы пропсы `href`, `onClick` которые нужно использовать для вызова навигации. В других случаях будет отрендерен `<a>` тег с children в качестве дочернего элемента

```ts
import { Link } from '@tinkoff/router';
import CustomLink from '@custom-scope/link';

export const Component = () => {
  return (
    <Link url="/test/">
      <CustomLink />
    </Link>
  );
};

export const WrapLink = () => {
  return <Link url="/test/">Click me</Link>;
};
```
