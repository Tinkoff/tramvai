import ifElse from '@tinkoff/utils/function/ifElse';
import isString from '@tinkoff/utils/is/string';
import escape from '@tinkoff/utils/string/escape';
import identity from '@tinkoff/utils/function/identity';

// Уровень, с которого мы перестаем доверять meta тегам и их необходимо очищать от лишнего
const META_PRIORITY_MIN_SAFE = 10;

const escapeMeta = ifElse(isString, escape, identity);
// Эскейпим пользовательские значения. Возможно XSS атака
export const transformValue = (item) => {
  if (item.priority > META_PRIORITY_MIN_SAFE) {
    return { priority: item.priority, value: escapeMeta(item.value) };
  }

  return item;
};
