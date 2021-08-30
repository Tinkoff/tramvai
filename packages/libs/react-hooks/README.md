# @tinkoff/react-hooks

Набор хуков для React.

### useShallowEqual

Позволяет добавить shallow equal проверку для переданного аргумента. Если новый аргумент будет равен предыдущему то результат хука останется тем же.

```tsx
import { useEffect } from 'react';
import { useShallowEqual } from '@tinkoff/react-hooks';

export function Cmp({ obj }) {
  // obj - некий объект
  // objRef - ссылка на объект obj, причем если сама ссылка на obj изменилась, но
  // сам obj остался shallowEqual к предыдущему, то objRef будет ссылаться на этот предыдущий объект
  const objRef = useShallowEqual(obj);

  useEffect(() => {
    // явно передать obj в качестве deps не всегда возможно, потому что react проверяет
    // deps со строгим сравнением ссылок, что может привести к вызову хука при каждом рендере
    // objRef ссылка же меняться не будет если новый obj поверхностно совпадает с предыдущим
  }, [objRef]);
}
```
