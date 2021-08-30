import { ChildContainer } from './ChildContainer';
import { Container } from './Container';
import { Scope } from './constant';

describe('new ChildContainer', () => {
  it('Обработка создания child версий инстансов', () => {
    const result = [];
    const resultTest = ['create C', 'create A', 'create C', 'create A', 'create B'];

    const rootContainer = new Container([
      {
        provide: 'C',
        useClass: class C {
          constructor() {
            result.push('create C');
          }
        },
      },
      {
        provide: 'A',
        useClass: class A {
          constructor() {
            result.push('create A');
          }
        },
        deps: { C: 'C' },
      },
      {
        provide: 'B',
        useClass: class B {
          constructor() {
            result.push('create B');
          }
        },
        scope: 'singleton',
      },
    ]);
    const childContainer1 = new ChildContainer(rootContainer);
    const childContainer2 = new ChildContainer(rootContainer);

    childContainer1.get('A');
    childContainer2.get('A');

    childContainer1.get('B');
    childContainer2.get('B');

    expect(result).toEqual(resultTest);
    childContainer1.get('A');
    childContainer2.get('A');

    childContainer1.get('B');
    childContainer2.get('B');
    expect(result).toEqual(resultTest);

    rootContainer.get('C');
    expect(result).toEqual([...resultTest, 'create C']);

    rootContainer.get('A');
    expect(result).toEqual([...resultTest, 'create C', 'create A']);
  });

  it('children инстансы и multi провайдеры', () => {
    const result = [];

    const rootContainer = new Container([
      {
        provide: 'A',
        useClass: class A {
          constructor() {
            result.push('create A');
          }
        },
        multi: true,
      },
      {
        provide: 'A',
        useClass: class A2 {
          constructor() {
            result.push('create A2');
          }
        },
        multi: true,
      },
    ]);
    const childContainer1 = new ChildContainer(rootContainer);
    const childContainer2 = new ChildContainer(rootContainer);

    childContainer1.get('A');
    childContainer2.get('A');
    childContainer1.get('A');
    childContainer2.get('A');
    childContainer1.get('A');
    childContainer2.get('A');

    expect(result).toEqual(['create A', 'create A2', 'create A', 'create A2']);

    rootContainer.get('A');
    expect(result).toEqual([
      'create A',
      'create A2',
      'create A',
      'create A2',
      'create A',
      'create A2',
    ]);
    rootContainer.get('A');
    childContainer1.get('A');
    childContainer2.get('A');
    expect(result).toEqual([
      'create A',
      'create A2',
      'create A',
      'create A2',
      'create A',
      'create A2',
    ]);
  });

  it('Заполнение children di приватными провайдерами', () => {
    /* Единичные провайдеры */
    const rootContainer = new Container([
      {
        provide: 'b',
        useValue: { a: 1 },
      },
    ]);
    const childContainer1 = new ChildContainer(rootContainer);
    const childContainer2 = new ChildContainer(rootContainer);

    childContainer1.register({
      provide: 'b',
      useValue: { a: 2 },
    });

    childContainer2.register({
      provide: 'b',
      useValue: { a: 3 },
    });

    expect(rootContainer.get('b')).toEqual({ a: 1 });
    expect(childContainer1.get('b')).toEqual({ a: 2 });
    expect(childContainer2.get('b')).toEqual({ a: 3 });

    /* MULTI провайдеры */
    const resultMulti1 = [];

    const generateProvider = (name) => {
      return {
        provide: 'c',
        useClass: class C {
          constructor({ b }) {
            resultMulti1.push(`Class ${name}: ${b.a}`);
          }
        },
        deps: {
          b: 'b',
        },
        multi: true,
      };
    };

    childContainer1.register(generateProvider('C1'));
    childContainer1.register(generateProvider('C2'));
    childContainer2.register(generateProvider('C3'));
    childContainer2.register(generateProvider('C4'));

    childContainer1.get('c');
    childContainer2.get('c');

    expect(resultMulti1).toEqual(['Class C1: 2', 'Class C2: 2', 'Class C3: 3', 'Class C4: 3']);
  });

  it('children provider должен инициализироваться заново в дочернем контейнере', () => {
    let b = 0;
    let c = 0;
    const rootContainer = new Container([
      {
        provide: 'a',
        useValue: { a: 1 },
      },
      {
        provide: 'b',
        useFactory: () => {
          return b++;
        },
      },
      {
        provide: 'c',
        useClass: class {
          c: number;

          constructor() {
            this.c = c++;
          }
        },
      },
    ]);
    const childContainer = new ChildContainer(rootContainer);

    expect(childContainer.get('a')).toBe(rootContainer.get('a'));

    expect(rootContainer.get('b')).toBe(0);
    expect(childContainer.get('b')).toBe(1);

    expect(rootContainer.get<any>('c').c).toBe(0);
    expect(childContainer.get<any>('c').c).toBe(1);
  });

  it('singleton провайдеры должны иметь доступ только к провайдерам из родительского контейнера', () => {
    const calls = [];

    const rootContainer = new Container([
      {
        provide: 'de',
        scope: Scope.SINGLETON,
        useFactory: () => {
          return 'root';
        },
      },
      {
        provide: 'rootTest',
        scope: Scope.SINGLETON,
        useFactory: ({ de }) => {
          calls.push({ name: 'rootTest', de });
        },
        deps: {
          de: 'de',
        },
      },
      {
        provide: 'rootDelay',
        scope: Scope.SINGLETON,
        useFactory: ({ de }) => {
          calls.push({ name: 'rootDelay', de });
        },
        deps: {
          de: 'de',
        },
      },
      {
        provide: 'request',
        useFactory: ({ de, root }) => {
          calls.push({ name: 'request', de });
        },
        deps: {
          de: 'de',
          root: 'rootDelay',
        },
      },
    ]);
    const childContainer = new ChildContainer(rootContainer);

    childContainer.register({ provide: 'de', useFactory: () => 'child' });

    expect(rootContainer.get('de')).toBe('root');
    expect(childContainer.get('de')).toBe('child');

    rootContainer.get('rootTest');
    childContainer.get('rootTest');
    childContainer.get('request');

    expect(calls).toEqual([
      { name: 'rootTest', de: 'root' },
      { name: 'rootDelay', de: 'root' },
      { name: 'request', de: 'child' },
    ]);
  });
});
