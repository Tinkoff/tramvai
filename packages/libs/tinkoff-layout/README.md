# @tinkoff/layout-factory

## Подключение

Необходимо установить `@tinkoff/layout-factory` с помощью npm

```bash
npm i @tinkoff/layout-factory
```

И подключить в проекте

```tsx
import React from 'react';
import { createLayout } from '@tinkoff/layout-factory';
import { Content, Page, Feedback } from './components';
import { layoutWrapper, feedbackWrapper } from './wrappers';

const MyLayout = createLayout({
  components: {
    page: Page,
    content: Content,
    feedback: Feedback,
  },
  wrappers: {
    layout: layoutWrapper,
    feedback: feedbackWrapper,
  }
});
```

## Структура лейаута

Концептуально лейаут имеет следующую структуру

```tsx
<LayoutWrapper>
  {globalComponents}
  <ContentWrapper>
    <HeaderWrapper>
      <Header />
    </HeaderWrapper>
    <PageWrapper>{page}</PageWrapper>
    <FooterWrapper>
      <Footer />
    </FooterWrapper>
  </ContentWrapper>
</LayoutWrapper>
```

Каждый враппер может быть кастомизирован. По умолчанию все врапперы просто отрисовывают переданные в них `children`. `HeaderWrapper` и `FooterWrapper` отрисовываются только если были переданы компоненты `Header` и `Footer` в props полученного лейаут компонента.

## Способы кастомизации

Кастомизировать создаваемый лейаут можно через опции `components` и `wrappers`

### Components

React компоненты

- `header`, `footer`, `layout`, `content`, `page` - это базовые компоненты для врапперов. Должны рендерить переданные в них children. По умолчанию `layout`, `content`, `page` - это "render children", а `header` и `footer` - "render prop"
- все остальные компоненты - `globalComponents`. Отрисовываются как компоненты внутри `LayoutWrapper`

### Wrappers

[HOC](https://ru.reactjs.org/docs/higher-order-components.html) для `components`

- `header`, `footer`, `layout`, `content`, `page` - HOC для базовых компонентов
- все остальные wrappers - HOC для соответствующих `globalComponents`

Можно указывать список из HOC, в таком случае очередность выполнения рендера обворачиваемого компонента от конца в начало

Такие врапперы нужны чтобы:

- скрывать/показывать элементы по необходимости
- навешивать дополнительные css стиили для компонентов
- встраивать дополнительную логику/обработчики
- прокидывать дополнительные props

Пример такого враппера

```tsx
function layoutWrapper(WrappedComponent) {
  return (props) => (
    <div className="ui-layout">
      <WrappedComponent {...props} />
    </div>
  );
}
```
