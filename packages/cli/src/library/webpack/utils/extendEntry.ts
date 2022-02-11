import isObject from '@tinkoff/utils/is/object';
import toArray from '@tinkoff/utils/array/toArray';

import type { EntryObject } from 'webpack';
import type Config from 'webpack-chain';

export const extendEntry = (
  entry: Config.EntryPoint,
  extension: Partial<Exclude<EntryObject[string], string | string[]>>
): Config.EntryPoint => {
  const values = entry.values();

  return entry.clear().merge(
    values.map((value) => {
      if (isObject(value) && 'import' in value) {
        return {
          ...value,
          ...extension,
          import: [...toArray(value.import), ...toArray(extension.import || [])],
        };
      }

      return {
        ...extension,
        import: [...toArray(value), ...toArray(extension.import || [])],
      };
    })
  );
};
