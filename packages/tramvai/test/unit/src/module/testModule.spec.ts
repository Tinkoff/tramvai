import { commandLineListTokens, DI_TOKEN, Module } from '@tramvai/core';
import { Container } from '@tinkoff/dippy';
import { testModule } from './testModule';

describe('test/unit/module/testModule`', () => {
  it('should test module', () => {
    const mockConstructor = jest.fn();

    @Module({
      providers: [
        {
          provide: 'testToken',
          useFactory: () => {
            return { a: 1 };
          },
        },
      ],
      deps: {
        di: DI_TOKEN,
        optToken: { token: 'optional_token', optional: true },
      },
    })
    class TestModule {
      constructor(deps) {
        mockConstructor(deps);
      }
    }

    const { di, module } = testModule(TestModule);

    expect(module).toBeInstanceOf(TestModule);
    expect(mockConstructor).toHaveBeenCalledWith({ di: expect.any(Container), optToken: null });
    expect(di.get('testToken')).toEqual({ a: 1 });
  });

  it('should test command line', async () => {
    const mock = jest.fn();

    @Module({
      providers: [
        {
          provide: commandLineListTokens.generatePage,
          multi: true,
          useFactory: () => {
            return mock;
          },
        },
      ],
    })
    class TestModule {}

    const { runLine } = testModule(TestModule);

    expect(() => runLine(commandLineListTokens.customerStart)).toThrow();
    expect(mock).not.toHaveBeenCalled();

    await runLine(commandLineListTokens.generatePage);

    expect(mock).toHaveBeenCalledWith();
  });
});
