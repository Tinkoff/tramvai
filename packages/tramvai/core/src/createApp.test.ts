// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-classes-per-file */
import { COMMAND_LINE_RUNNER_TOKEN } from '@tramvai/core';
import { commandLineListTokens } from '@tramvai/tokens-core';
import type { ModuleType } from '@tinkoff/dippy';
import { INVALID_MODULE_ERROR, Module } from '@tinkoff/dippy';
import { createApp } from './createApp';
import { createBundle } from './bundles/createBundle';

describe('createApp', () => {
  it('Создание и запуск приложения', async () => {
    let execute = false;

    @Module({
      providers: [
        {
          provide: 'level-3',
          useValue: 'three',
        },
      ],
    })
    class ModuleLevel3 {}

    @Module({
      providers: [
        {
          provide: 'level-2',
          useValue: 'two',
        },
      ],
      imports: [ModuleLevel3 as ModuleType],
    })
    class ModuleLevel2 {}

    @Module({
      providers: [
        {
          provide: 'level-1',
          useValue: 'one',
        },
      ],
      imports: [ModuleLevel2 as ModuleType],
    })
    class ModuleLevel1 {}

    const appInst = await createApp({
      name: 'testApp',
      modules: [ModuleLevel1 as ModuleType],
      providers: [
        {
          provide: COMMAND_LINE_RUNNER_TOKEN,
          useClass: class CommandLine {
            di: any;

            constructor({ di }) {
              this.di = di;
            }

            run() {
              return this.di.get(commandLineListTokens.init)[0]();
            }
          },
          deps: {
            di: 'di',
          },
        },
        {
          provide: commandLineListTokens.init,
          useValue: () => {
            return Promise.resolve().then(() => {
              execute = true;
            });
          },
          multi: true,
        },
      ],
      bundles: {
        key: () => Promise.resolve({ default: createBundle({ name: 'test', components: {} }) }),
      },
    });

    expect(execute).toBe(true); // проверяем, что команды выполняются
    expect(appInst.di).toBeDefined(); // публичный интерфейс

    expect(appInst.di.get('level-1')).toBe('one'); // Проверяем инициализацию 1 уровня
    expect(appInst.di.get('level-2')).toBe('two'); // Проверяем инициализацию 2 уровня
    expect(appInst.di.get('level-3')).toBe('three'); // Проверяем инициализацию 3 уровня

    expect(appInst.di.get('appInfo')).toEqual({ appName: 'testApp' });
  });

  it('Циклические импорты', async () => {
    const module2imports = [];
    const module1imports = [];
    @Module({
      providers: [
        {
          provide: 'module-2',
          useValue: 'two',
        },
      ],
      imports: module2imports,
    })
    class Module2 {}

    @Module({
      providers: [
        {
          provide: 'module-1',
          useValue: 'one',
        },
      ],
      imports: module1imports,
    })
    class Module1 {}

    module2imports.push(Module1);
    module1imports.push(Module2);

    const appInst = await createApp({
      name: 'testApp',
      modules: [Module1 as ModuleType],
      providers: [
        {
          provide: COMMAND_LINE_RUNNER_TOKEN,
          useClass: class CommandLine {
            run() {
              return Promise.resolve();
            }
          },
        },
      ],
      bundles: {
        key: () => Promise.resolve({ default: createBundle({ name: 'test', components: {} }) }),
      },
    });

    expect(appInst.di.get('module-1')).toBe('one');
    expect(appInst.di.get('module-2')).toBe('two');
  });

  it('Выбрасываем ошибку если передан некорректный модуль в список модулей', () => {
    @Module({
      providers: [
        {
          provide: 'module1',
          useValue: '1',
        },
      ],
    })
    class Module1 {
      static forRoot() {
        return {
          mainModule: Module1,
        };
      }
    }
    const mockWithModules = (modules, shoudThrow) => {
      const func = () =>
        createApp({
          modules,
          name: 'testApp',
          providers: [
            {
              provide: COMMAND_LINE_RUNNER_TOKEN,
              useValue: {
                run: () => Promise.resolve(),
              },
            },
          ],
          bundles: {},
        });
      return shoudThrow
        ? // eslint-disable-next-line jest/no-conditional-expect
          expect(() => func()).toThrow(INVALID_MODULE_ERROR)
        : // eslint-disable-next-line jest/no-conditional-expect
          expect(() => func()).not.toThrow(INVALID_MODULE_ERROR);
    };

    mockWithModules([Module1, undefined, () => {}, null, {}, Object.create(null)], true);
    mockWithModules([Module1, Module1.forRoot(), { mainModule: Module1 }], false);
  });

  it('Инициализация дубликатов модулей', async () => {
    const spyConsole = jest.spyOn(console, 'error').mockImplementation();
    expect.assertions(1);
    const createModule = () => {
      @Module({
        providers: [
          {
            provide: 'module-2',
            useValue: 'two',
          },
        ],
      })
      class ModuleTest {}

      return ModuleTest;
    };

    await createApp({
      name: 'testApp',
      modules: [createModule(), createModule()],
      providers: [
        {
          provide: COMMAND_LINE_RUNNER_TOKEN,
          useClass: class CommandLine {
            run() {
              return Promise.resolve();
            }
          },
        },
      ],
      bundles: {
        key: () => Promise.resolve({ default: createBundle({ name: 'test', components: {} }) }),
      },
    });

    expect(spyConsole).toHaveBeenCalledTimes(1);
  });

  it('Инициализируем модуль и его зависимости', async () => {
    const dependencyAppMock = jest.fn();
    const dependencyModule1Mock = jest.fn();

    @Module({
      providers: [
        {
          provide: 'dependencyModule1',
          useValue: dependencyModule1Mock,
        },
      ],
      deps: {
        dependencyApp: 'dependencyApp',
        dependencyModule1: 'dependencyModule1',
      },
    })
    class Module1 {
      constructor({ dependencyApp, dependencyModule1 }) {
        dependencyApp();
        dependencyModule1();
      }
    }

    await createApp({
      modules: [Module1],
      name: 'testApp',
      providers: [
        {
          provide: 'dependencyApp',
          useValue: dependencyAppMock,
        },
        {
          provide: COMMAND_LINE_RUNNER_TOKEN,
          useValue: {
            run: () => Promise.resolve(),
          },
        },
      ],
      bundles: {},
    });

    expect(dependencyAppMock).toHaveBeenCalledTimes(1);
    expect(dependencyModule1Mock).toHaveBeenCalledTimes(1);
  });

  it('Инициализируем вложенный модуль и его зависимости', async () => {
    const dependencyModuleLevel1Mock = jest.fn();
    const dependencyModuleLevel2Mock = jest.fn();

    @Module({
      providers: [
        {
          provide: 'dependencyModuleLevel2',
          useValue: dependencyModuleLevel2Mock,
        },
      ],
      deps: {
        dependencyModuleLevel1: 'dependencyModuleLevel1',
      },
    })
    class ModuleLevel2 {
      constructor({ dependencyModuleLevel1 }) {
        dependencyModuleLevel1();
      }
    }

    @Module({
      imports: [ModuleLevel2],
      providers: [
        {
          provide: 'dependencyModuleLevel1',
          useValue: dependencyModuleLevel1Mock,
        },
      ],
      deps: {
        dependencyModuleLevel2: 'dependencyModuleLevel2',
      },
    })
    class ModuleLevel1 {
      constructor({ dependencyModuleLevel2 }) {
        dependencyModuleLevel2();
      }
    }

    await createApp({
      modules: [ModuleLevel1],
      name: 'testApp',
      providers: [
        {
          provide: COMMAND_LINE_RUNNER_TOKEN,
          useValue: {
            run: () => Promise.resolve(),
          },
        },
      ],
      bundles: {},
    });

    expect(dependencyModuleLevel1Mock).toHaveBeenCalledTimes(1);
    expect(dependencyModuleLevel2Mock).toHaveBeenCalledTimes(1);
  });

  it('Инициализируем вложенные модули в первую очередь', async () => {
    const modulesInitializationOrder = [];
    const dependencyModuleLevel1Mock = jest.fn((moduleLevel: number) =>
      modulesInitializationOrder.push(moduleLevel)
    );
    const dependencyModuleLevel2Mock = jest.fn((moduleLevel: number) =>
      modulesInitializationOrder.push(moduleLevel)
    );

    @Module({
      providers: [
        {
          provide: 'dependencyModuleLevel2',
          useValue: dependencyModuleLevel2Mock,
        },
      ],
      deps: {
        dependencyModuleLevel1: 'dependencyModuleLevel1',
      },
    })
    class ModuleLevel2 {
      constructor({ dependencyModuleLevel1 }) {
        dependencyModuleLevel1(2);
      }
    }

    @Module({
      imports: [ModuleLevel2],
      providers: [
        {
          provide: 'dependencyModuleLevel1',
          useValue: dependencyModuleLevel1Mock,
        },
      ],
      deps: {
        dependencyModuleLevel2: 'dependencyModuleLevel2',
      },
    })
    class ModuleLevel1 {
      constructor({ dependencyModuleLevel2 }) {
        dependencyModuleLevel2(1);
      }
    }

    await createApp({
      modules: [ModuleLevel1],
      name: 'testApp',
      providers: [
        {
          provide: COMMAND_LINE_RUNNER_TOKEN,
          useValue: {
            run: () => Promise.resolve(),
          },
        },
      ],
      bundles: {},
    });

    expect(modulesInitializationOrder).toEqual([2, 1]);
  });
});
