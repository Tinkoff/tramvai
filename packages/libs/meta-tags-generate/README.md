# Meta tags generate

Library for generating and updating meta-tags in browser.

## Api

- `Meta({ list: [] }): Meta` - object used for constructing an instance of meta-tags based on passed sources
- `Render(meta: Meta): { render(): string }` - render of specific _Meta_ instance as a string. Used in SSR
- `Update(meta: Meta): { update(): void }` - updates meta-tags layout in browser. Used in browser while SPA-navigations

### Format

Library accepts special parameters which are used to generate result html tags. These parameters have next format:

```js
{
  customTag: { tag: 'meta', attributes: { name: 'k', content: 'i' }, innerHtml: '1' }
}
```

thar renders in the next tag:

```html
<meta name="k" content="i">1</meta>
```

### Converters

Converters are used to convert meta-tags with specific keys in [format view](#format)

```tsx
new Meta({ list, converters: { title: (value) => ({ tag: 'meta', innerHtml: value }) } });
```

After that you now can pass meta as `{ title: 'Тинькофф' }` in order to render it through converter above.

### Sources

Through options `list` can be passed sources for meta-tags generating. These sources have the form of function that are called in runtime for generating result render. E.g.:

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

When generating meta tags all functions passed in `list` will be called with argument of class `Walker`. Inside such function it is possible to modify data using method `updateMeta`, which accepts the priority of the change and value. Elements with higher priority overrides values with lower priorities.

## How to

### Set Meta

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

new Update(meta).update(); // Removes all previous meta and adds new one
```

### Remove meta parameters

In order to remove data just pass `null` as a value.

E.g. if you want to remove `keywords` meta:

```javascript
(walker) =>
  walker.updateMeta(30, {
    keywords: null,
  });
```

After that specified meta tag will be remove
