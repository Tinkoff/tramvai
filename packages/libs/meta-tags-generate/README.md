# Meta tags generate

Библиотека для генерации и обновления мета-тегов на странице.

## Api

- `Meta({ list: [] }): Meta` - объект используемый для конструирования объекта мета-тегов на основании заданных источников.
- `Render(meta: Meta): { render(): string }` - рендер конкретного объекта _Meta_ в виде строки (используется для SSR)
- `Update(meta: Meta): { update(): void }` - обновляет верстку мета-тегов в браузере (используется в браузере при SPA-переходах)

## Пример использования

```tsx
import { Meta, Render, Update } from '@tinkoff/meta-tags-generate';

const list = [
  (walker) =>
    walker.updateMeta(10, {
      title: 'test',
      tag: { tag: 'meta', attributes: { link: 'link' } },
    }),
];
const meta = new Meta({ list, converters });

const metaContent = new Render(meta).render();
console.log(metaContent); // > <title>test</title><meta link=link/>

new Update(meta).update(); // Удалит все старые мета теги и заменит новыми
```

## Источники

В мета теги можно передать источник данных в параметр `list` которые будут вызваны в рантайме для сбора итогового результата.

Например:

```tsx
const list = [
  (walker) =>
    walker.updateMeta(10, {
      title: 'test',
      tag: { tag: 'meta', attributes: { link: 'link' } },
    }),
  (walker) =>
    walker.updateMeta(20, {
      title: 'tinkoff',
      ogTitle: 'tinkoff',
    }),
];
const meta = new Meta({ list, converters });
```

При генерации мета тегов будет вызваны по порядку функции из `list` в который будет прокинут класс `walker`. Внутри функции можно смодифицировать данные вызывая метод `updateMeta` в который передается приоритет правок и параметры. Элементы с более высоким приоритетом, перезаписывают значения более низких

## Параметры

Библиотека принимает параметры с определенным типом, которые позволяют сгенерировать html теги. Для этого нужно передать в значение следующий формат данных

```js
{
  customTag: { tag: 'meta', attributes: { name: 'k', content: 'i' }, innerHtml: '1' }
}
```

в итоге после преобразований, получится следующий тег:

```html
<meta name="k" content="i">1</meta>
```

### Удаление meta параметров

Для удаление данных, нам нужно в поле `value` вставить `null` значение

Например мы хотим удалить `keywords` свойство:

```javascript
(walker) =>
  walker.updateMeta(30, {
    keywords: null,
  });
```

После выполнения этого источника, мета тег удалится

## Конвертеры

Для упрощения использования библиотеки, мы можем передать в `Meta` список конвертеров в параметров `converters`

```tsx
new Meta({ list, converters: { title: (value) => ({ tag: 'meta', innerHtml: value }) } });
```

При построения мета тегов, мы будем пытаться получить по ключу в блоке converters функцию для преобразования. И это нам позволяет передавать мета параметры вида `{ title: 'Тинькофф' }`
