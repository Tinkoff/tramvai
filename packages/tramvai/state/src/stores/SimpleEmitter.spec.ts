import { SimpleEmitter } from './SimpleEmitter';

describe('SimpleEmitter', () => {
  it('Подписка на события', () => {
    const emitter = new SimpleEmitter();

    const result = [];
    emitter.on('change', () => {
      result.push('first');
    });
    emitter.on('change', () => {
      result.push('second');
    });
    emitter.on('change', () => {
      result.push('third');
    });
    expect(result).toEqual([]);
    emitter.emit('change');
    expect(result).toEqual(['first', 'second', 'third']);
  });

  it('Отписка от событий', () => {
    const emitter = new SimpleEmitter();
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    emitter.on('change', fn1);
    emitter.on('change', fn1);
    emitter.on('change', fn1);
    emitter.on('change', fn2);
    emitter.on('change', fn2);
    emitter.on('change', fn2);
    emitter.off('change', fn2);
    emitter.emit('change');
    expect(fn1).toBeCalled();
    expect(fn2).not.toBeCalled();
    fn1.mockClear();
    emitter.off('change', fn1);
    emitter.emit('change');
    expect(fn1).not.toBeCalled();
    expect(fn2).not.toBeCalled();
  });
});
