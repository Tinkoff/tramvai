# @tinkoff/url

Библиотека утилит для работы с url. В основе библиотеки стандартартная реализация [URL](https://url.spec.whatwg.org/#url-class) и [URLSearchParams](https://url.spec.whatwg.org/#interface-urlsearchparams), для работы в средах которые не поддерживают этот функционал требуется полифиллы: [например core-js](https://github.com/zloirock/core-js#url-and-urlsearchparams)

## Api

### parse

Парсит урл и возвращает объект класса URL c дополнительным свойством query - для представления searchParams в виде простого объекта.

```tsx
import { parse } from '@tinkoff/url';

const url = parse('https://tinkoff.ru/test/?a=1&b=2#abc');

url.protocol; // => :https
url.href; // => https://tinkoff.ru/test/?a=1&b=2#abc
url.origin; // => https://tinkoff.ru
url.pathname; // => /test/
url.hash; // => #abc
url.query; // => { a: '1', b: '2' }
```

### rawParse

То же самое, что и `parse`, только вместо обёртки для URL возвращает сырой объект URL

### resolve

Вычисляет для относительного урла итоговый урл относительного базового значения

```tsx
import { resolve } from '@tinkoff/url';

resolve('//tinkoff.ru', './test123'); // => http://tinkoff.ru/test123
resolve('//tinkoff.ru/a/b/c/', '../../test'); // => http://tinkoff.ru/a/test
resolve('https://tinkoff.ru/a/b/c/?test=123#abc', '.././test/?me=123#123'); // => https://tinkoff.ru/a/b/test/?me=123#123
```

### resolveUrl

Вычисляет для относительного урла итоговый урл относительного базового значения (базовое значение может быть как строкой так и объектом URL)

### rawResolveUrl

То же самое, что и `resolveUrl`, только вместо обёртки возвращает сырой объект URL

### isAbsoluteUrl

Определяет является ли переданная строка абсолютным урлом

### isInvalidUrl

Определяет является ли данный урл неправильным (это урлы вида `//`, `/////`)

```tsx
import { isAbsoluteUrl } from '@tinkoff/url';

isAbsoluteUrl('https://www.exmaple.com'); // true - secure http absolute URL
isAbsoluteUrl('//cdn.example.com/lib.js'); // true - protocol-relative absolute URL
isAbsoluteUrl('/myfolder/test.txt'); // false - relative URL
```

### convertRawUrl

Возвращает удобную обёртку для URL в виде plain object с несколькими дополнительными полями

### rawAssignUrl

Позволяет задать опции в переданный сырой объект URL (**Переданные объект будет изменён**)
