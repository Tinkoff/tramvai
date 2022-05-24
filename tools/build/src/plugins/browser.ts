import mapObj from '@tinkoff/utils/object/map';
import escapeRegexp from '@tinkoff/utils/string/escapeRegExp';

import type { Plugin } from 'rollup';

// на windows приходится нормализовать пути иначе в некоторых случаях путь приходит c обратными слешами
// это например происходит для entry и для чанков подключенных через require
const normalizePath = (name: string) => name.replace(/\\/g, '/');

// Probably this plugin can be replaced by [node-resolve](https://www.npmjs.com/package/@rollup/plugin-node-resolve)
// with proper mainFields configuration
export const browserPlugin = (mapping: Record<string, string>): Plugin => {
  const regex = mapObj((entry, key) => new RegExp(`${escapeRegexp(key)}$`), mapping);
  const keys = Object.keys(mapping);

  return {
    name: 'browser-build',
    load(source) {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (regex[key].test(source)) {
          const name = normalizePath(source.replace(regex[key], mapping[key]));

          return `export * from '${name}';`;
        }
      }
    },
  };
};
