import { formatSageJson } from './formatSageJson';
import type { LogArgs } from '../../logger.h';

const restArgs = ['one', 2, 'three', 4, { foo: 'bar' }, { baz: 5 }, [1], ['2'], [{ '3': 4 }]];

const argsCombs = [
  ['Object', [{ message: 'zero' }, ...restArgs]],
  ['Error', [new Error('-1'), 'zero', ...restArgs]],
  ['String', ['zero', ...restArgs]],
];

describe('reporters/utils/formatSageJson', () => {
  argsCombs.forEach(([firstArgType, args]) => {
    describe(`first arg is ${firstArgType}`, () => {
      it('should add strings and numbers from args to message array', () => {
        const { message } = formatSageJson({
          name: 'name',
          date: new Date(),
          level: 0,
          args: args as LogArgs,
        });

        expect(message).toEqual(['zero', 'one', 2, 'three', 4]);
      });

      it('should add objects to "objects" array', () => {
        const { objects } = formatSageJson({
          name: 'name',
          date: new Date(),
          level: 0,
          args: args as LogArgs,
        });

        expect(objects).toEqual([{ foo: 'bar' }, { baz: 5 }]);
      });

      it('should add arrays to "arrays" array', () => {
        const { arrays } = formatSageJson({
          name: 'name',
          date: new Date(),
          level: 0,
          args: args as LogArgs,
        });

        expect(arrays).toEqual([[1], ['2'], [{ '3': 4 }]]);
      });
    });
  });
});
