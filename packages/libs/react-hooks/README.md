# @tinkoff/react-hooks

Set of React Hooks

## Api

### useShallowEqual

Makes shallow equal check for passed argument. If current argument is equal to previous then result of the hook will not be changed. Otherwise it will be equal to a current argument.

```tsx
import { useEffect } from 'react';
import { useShallowEqual } from '@tinkoff/react-hooks';

export function Cmp({ obj }) {
  // obj - some object
  // objRef - reference to object. For example, if reference obj were changed after sequential render,
  // but it still shallow equals to initial obj then objRef will reference to the initial obj ссылка на объект obj
  const objRef = useShallowEqual(obj);

  useEffect(() => {
    // React checks deps with reference equality that may lead to unnecessary hook call when reference were changed
    // but we care only about actual changes to object itself not reference
    // in that case objRef will not lead to effect call in case new reference is shallowly equal to previous
  }, [objRef]);
}
```
