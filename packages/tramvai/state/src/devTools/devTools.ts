import noop from '@tinkoff/utils/function/noop';
import pick from '@tinkoff/utils/object/pick';
import startsWith from '@tinkoff/utils/string/startsWith';
import isElement from '@tinkoff/utils/is/element';

const elementReplacer = pick(['tagName', 'id', 'className']);

// eslint-disable-next-line import/no-mutable-exports
let devTools = {
  init: noop,
  send: noop,
  subscribe: noop,
  error: noop,
};

// eslint-disable-next-line no-underscore-dangle,@typescript-eslint/no-explicit-any
if (typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION__) {
  // eslint-disable-next-line no-underscore-dangle,@typescript-eslint/no-explicit-any
  devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect({
    name: 'Tinkoff-client',
    latency: 700,
    serialize: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      replacer: (key: string, value: any) => {
        // eslint-disable-next-line default-case
        switch (true) {
          case isElement(value):
            return elementReplacer(value);
          case startsWith('_reactInternal', `${key}`):
            return '_reactInternal';
        }

        return value;
      },
    },
  });
}

export { devTools };
