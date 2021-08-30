import isArray from '@tinkoff/utils/is/array';
import isObject from '@tinkoff/utils/is/object';
import mergeWith from '@tinkoff/utils/object/mergeWith';

export const merge = mergeWith((x, y) => {
  if (isArray(x) && isArray(y)) {
    return x.concat(y);
  }

  if (isObject(x) && isObject(y)) {
    return merge(x, y);
  }

  return y;
});
