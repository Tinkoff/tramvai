# React

`@tramvai/react` - библиотека для интеграции возможностей `tramvai` с `React` компонентами

## Подключение в проекте

```bash
npm i --save @tramvai/react
```

## DI

При создание компонентов вам может понадобиться получение данных с di для этого есть hook `useDi` и HoC `withDi`

### useDi

```tsx
type useDi = (deps: Record<string, string | Token>) => Record<string, any>;
```

```tsx
type useDi = (dep: string | Token) => any;
```

Хук в который мы можем передать как объект с требуемыми зависимостями и нам вернется объект с данными, так и единичный token, где нам вернется результат. При вызове `useDi` мы получаем данные из di и если мы не нашли данных в di, произойдет ошибка.

```javascript
import React from 'react';
import { useDi } from '@tramvai/react';

const MyComponent = () => {
  const { logger } = useDi({ logger: 'logger' }); // передаем объект
  const Region = useDi(regionToken); // передаем единичный токен

  logger.info('text');

  return (
    <div>
      Component
      <Region />
    </div>
  );
};
```

### withDi

```tsx
type withDi = (
  deps: Record<string, string | Token>
) => (wrapper: React.ReactElement<any>) => React.ReactElement<any>;
```

Хок, который позволяет обернуть любые компоненты, получить данные из `DI` и передать результат с зависимостями в props компонента

```javascript
import React from 'react';
import { withDi } from '@tramvai/react';

@withDi({ logger: LOGGER_TOKEN })
class BoxyPage extends Component {
  render() {
    this.props.logger.info('text');
    return <div>Component</div>;
  }
}
```

### useDiContainer

```tsx
type useDiContainer = () => DI.Container;
```

Получение инстанса DI контейнера который был добавлен в контекст приложения.

Лучше не пользоваться этим hook, так как он сильно низкоуровневый и предназначен для разработки новых hook

## Error

Для обработки ошибок при рендере в React используются [Error Boundary](https://ru.reactjs.org/docs/error-boundaries.html#introducing-error-boundaries). Этот пакет предоставляет свою версию Error Boundary которая залогирует ошибку через общий логгер и отобразит заглушку для обернутого компонента если произошла ошибка.

### ErrorBoundary

Error Boundary компонент, который следит за ошибками ниже по дереву и в случае возникшей ошибки рендера залогирует ошибку и отобразит компонент `fallbackComponent` (передается как пропс, по дефолту это FallbackError из этого пакета) вместо упавшего поддерева рендера.

Можно переопределить `fallbackComponent` через провайдер `ERROR_BOUNDARY_FALLBACK_COMPONENT_TOKEN`.

### FallbackError

Компонент используемый по умолчанию как заглушка для поддерева в котором призошла ошибка рендера

### withError

Хок оборачивающий компонент в ErrorBoundary.

## lazy

Для динамического импорта компонентов с поддержкой SSR, существует high order компонент `lazy`:

```tsx
import { lazy } from '@tramvai/react';

const LazyComponent = lazy(() => import('./components/foo'), {
  loading: <div>Загрузка...</div>,
});

<LazyComponent />;
```
