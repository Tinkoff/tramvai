# Validators

Tiny library with validators for env variables

## Installation

```bash
npm i --save @tinkoff/env-validators
```

or

```bash
yarn add @tinkoff/env-validators
```

## Validators List

- isUrl - check if string is valid URL
- isNumber - check if value is number
- isTrue - check if value is true
- isFalse - check if value is false
- isOneOf - check if value is one of presented

## Validators Interface

```
(value: string) => boolean | string;
```

Returns any boolean (true or false) if value is valid, string with error otherwise

## Usage

### isUrl

```tsx
import { isUrl } from '@tinkoff/env-validators';

isUrl('https://google.com'); // false
isUrl('Not valid url'); // 'URL is not valid'
```

### isNumber

```tsx
import { isNumber } from '@tinkoff/env-validators';

isNumber('https://google.com'); // value is not a number
isNumber('5'); // true
```

### isTrue

```tsx
import { isTrue } from '@tinkoff/env-validators';

isTrue('something'); // value is not a true
isTrue('true'); // true
```

### isFalse

```tsx
import { isFalse } from '@tinkoff/env-validators';

isFalse('true'); // value is not a false
isFalse('false'); // true
```

### isOneOf

```tsx
import { isOneOf } from '@tinkoff/env-validators';

isOneOf(['1', '2', '3'])('isOneOf'); // value is not in list
isOneOf(['1', '2'])('1'); // true
isOneOf(['true', 'false'])('true'); // true
```

### startsWith

```tsx
import { startsWith } from '@tinkoff/env-validators';

startsWith('https')('http://google.com'); // value should starts with https
startsWith('http')('http://yandex.ru'); // true
```

### endsWith

```tsx
import { endsWith } from '@tinkoff/env-validators';

endsWith('/')('https://google.com'); // value should ends with /
endsWith('/')('http://yandex.ru/'); // true
```

or to validate ENV variable in @tramvai

```
import { provide } from '@tramvai/core';
import { isUrl } from '@tinkoff/env-validators';
import { ENV_USED_TOKEN } from '@tramvai/module-common';

providers: [
  provide({
    provide: ENV_USED_TOKEN,
    multi: true,
    useValue: [
      { key: 'TINKOFF_API', validator: isUrl },
    ],
  }),
]
```

## Combinations of validators

To combine two or more validators call `combineValidators` method like this:

```
import { endsWith, isUrl, combineValidators } from '@tinkoff/env-validators';

combineValidators([isUrl, endsWith('/')])('https://google.com'); // 'value should ends with /'
combineValidators([isUrl, endsWith('/')])('not url but with backslash/'); // 'URL is not valid'
combineValidators([isUrl, endsWith('/')])('not url at all'); // 'URL is not valid; value should ends with /'
combineValidators([isUrl, endsWith('/')])('https://google.com/'); // false
```

or to validate ENV variable in @tramvai

```
import { provide } from '@tramvai/core';
import { endsWith, isUrl, combineValidators } from '@tinkoff/env-validators';
import { ENV_USED_TOKEN } from '@tramvai/module-common';

providers: [
  provide({
    provide: ENV_USED_TOKEN,
    multi: true,
    useValue: [
      { key: 'TINKOFF_API', validator: combineValidators([isUrl, endsWith('/')]) },
    ],
  }),
]
```
