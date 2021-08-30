# Client Hints

Модуль позволяющий получить различные характеристики от клиента, например тип устройства, размеры экрана и т.п.

## Подключение в проект

### 1. Зависимости

Необходимо установить `@tramvai/module-client-hints` с помощью npm

```bash
npm i --save @tramvai/module-client-hints
```

или

```bash
yarn add @tramvai/module-client-hints
```

### 2. Подключение модуля

Нужно передать в список модулей приложения ClientHintsModule

```tsx
import { createApp } from '@tramvai/core';
import { ClientHintsModule } from '@tramvai/module-client-hints';

createApp({
  modules: [ClientHintsModule],
});
```

## Экспортируемые токены

### USER_AGENT_TOKEN

Объект - результат парсинга строки юзер-агента с помощью [@tinkoff/user-agent](../libs/user-agent.md). Парсинг происходит только на сервере, на клиенте - используется инфомация с сервера.

## Сторы

### userAgent

Стор который хранит результат парсинга юзер-агента.

### media

Стор который хранит медиа-информацию о типе и размере экрана клиента.

#### API для проверки media

Данные в сторе media:

```tsx
type Media = {
  width: number;
  height: number;
  isTouch: boolean;
  retina: boolean;
  supposed?: boolean;
  synchronized?: boolean;
};
```

`fromClientHints(media: Media): boolean` - возвращает true, когда media синхронизированны на сервере и на клиенте

`isSupposed(media: Media): boolean` - возвращает true, когда media определены на сервере по User-Agent, и могут измениться на клиенте

`isRetina(media: Media): boolean` - вовзращает true, когда плотность пикселей на экране 2 или выше

`useMedia(): Media` - возвращает текущее состояние стора media

`useFromClientHints(): boolean` - вычисляет fromClientHints из стора media

`useIsSupposed(): boolean` - вычисляет isSupposed из стора media

`useIsRetina(): boolean` - вычисляет isRetina из стора media

## Особенности работы с media на сервере и клиенте

Одна из проблем SSR - рендеринг компонентов, которые зависят от текущего размера экрана, например карусель изображений, которая должна рендерить определенное количество картинок, в зависимости от ширины экрана. По умолчанию, узнать точные размеры мы можем только на стороне клиента, и не имеем возможности отрисовать на сервере контент, идентичный клиенту. Если этот контент не требуется для SEO, можно использовать скелетоны или спиннеры, но это подходит не для всех случаев.

Модуль Client Hints позволяет частично решить эту проблему, сохраняя данные об устройстве пользователя в cookies при первом заходе, и используя эти данные на сервере при следующих заходах на страницы приложения.

### Механизм работы Client Hints

#### Первый заход на страницу

При первом заходе на страницу, на стороне сервере, модуль определяет тип устройство по User-Agent, и сохраняет **предположительные** данные об устройстве в стор `media`. Например, при первом заходе с компьютера, значение стора `media` будет таким:

```tsx
const state = {
  width: 1024,
  height: 768,
  isTouch: false,
  retina: false,
  supposed: true,
  synchronized: false,
};
```

На клиенте, ориентируясь на значение `supposed: true`, модуль получает **реальные** данные об устройстве, и обновляет стор `media`, вызывая перерендер зависимых компонентов. После этого, для широкоэкранного монитора, значение стора `media` может быть таким:

```tsx
const state = {
  width: 1920,
  height: 1080,
  isTouch: false,
  retina: true,
  supposed: false,
  synchronized: false,
};
```

Пока мы имеем значение `synchronized: false`, **нельзя** полагаться на данные из `media` для серверного рендеринга компонентов, т.к. это вызовет "скачок" при сохранении реальных данных об устройстве.

#### Повторный заход на страницу

При повторном заходе на страницу, данные об устройстве считываются из cookies, значение `synchronized` выставляется в `true`. Таким образом, и на сервере, и на клиенте, мы получим одно значение стора `media`, и отсутствие перерендера на клиенте:

```tsx
const state = {
  width: 1920,
  height: 1080,
  isTouch: false,
  retina: true,
  supposed: false,
  synchronized: true,
};
```

#### Итоги

Общая информация для компонентов, которые зависят от текущего размера экрана:

1. При первом заходе на страницу, **нельзя** гарантировать одинаковый результат рендеринга на сервере и на клиенте

2. При первом заходе на страницу, можно показать юзеру скелетон компонента, отображая скелетон при свойстве `supposed: true`

3. Гарантировать одинаковый результат рендеринга на сервере и на клиенте можно при свойстве `synchronized: true`

Рецепт, который позволит показать скелетон только один раз, при первой загрузке приложения:

```tsx
const App = () => {
  const isSupposed = useIsSupposed();

  if (isSupposed) {
    return <AdaptiveSliderSkeleton />;
  }

  return <AdaptiveSlider />;
};
```

Рецепт, который позволит рендерить общий адаптивный компонент при первой загрузке приложения, и выбирать отдельные под desktop и mobile при повторных загрузках:

```tsx
const App = () => {
  const media = useMedia();
  const fromClientHints = useFromClientHints();

  let Block = AdaptiveBlock;

  if (fromClientHints) {
    Block = media.width >= 1024 ? DesktopBlock : MobileBlock;
  }

  return <Block />;
};
```
