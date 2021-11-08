# @tinkoff/url

Utilities to work with urls. Based on standard implementation of [URL](https://url.spec.whatwg.org/#url-class) and [URLSearchParams](https://url.spec.whatwg.org/#interface-urlsearchparams), in case environment does not support these object polyfills should be used, [e.g. core-js](https://github.com/zloirock/core-js#url-and-urlsearchparams).

## Api

### parse

Parses url and returns object of class URL with additional property query which represents searchParams as a simple object.

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

Same as [parse](#parse) but instead of returning wrapper for URL returns raw URL object

### resolve

Computes absolute url for relative url of base value

```tsx
import { resolve } from '@tinkoff/url';

resolve('//tinkoff.ru', './test123'); // => http://tinkoff.ru/test123
resolve('//tinkoff.ru/a/b/c/', '../../test'); // => http://tinkoff.ru/a/test
resolve('https://tinkoff.ru/a/b/c/?test=123#abc', '.././test/?me=123#123'); // => https://tinkoff.ru/a/b/test/?me=123#123
```

### resolveUrl

Computes absolute url for relative url of base value. Unlike [resolve](#resolve) can accept string or URL and return URL wrapper

### rawResolveUrl

Same as [resolveUrl](#resolveurl) but instead of returning wrapper for URL returns raw URL object

### isAbsoluteUrl

Checks that passed string is absolute url

### isInvalidUrl

Checks that passed string represents invalid url

```tsx
import { isAbsoluteUrl } from '@tinkoff/url';

isAbsoluteUrl('https://www.exmaple.com'); // true - secure http absolute URL
isAbsoluteUrl('//cdn.example.com/lib.js'); // true - protocol-relative absolute URL
isAbsoluteUrl('/myfolder/test.txt'); // false - relative URL
```

### convertRawUrl

Returns handy wrapper for URL in form of plain object with some additional fields

### rawAssignUrl

Allows to set parameters to passed raw URL object (**passed URL-object will be changed**)
