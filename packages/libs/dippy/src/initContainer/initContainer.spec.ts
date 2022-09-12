import { initContainer } from './initContainer';
import { createToken } from '../createToken/createToken';
import { Module } from '../modules/module';

describe('initContainer', () => {
  it('di container created', () => {
    const token = createToken('logger');

    const di = initContainer({
      providers: [{ provide: token, useValue: 'log' }],
    });

    expect(di.get(token)).toBe('log');
  });

  it('modules resolved manually', () => {
    const loggerToken = createToken('logger');
    const dependencyToken = createToken('dependency');
    const dependencyFn = jest.fn();

    const LoggerModule = Module({
      providers: [{ provide: loggerToken, useValue: 'log' }],
      deps: { dependency: dependencyToken },
    })(
      class LoggerModule {
        constructor({ dependency }) {
          dependency();
        }
      }
    );

    const di = initContainer({
      modules: [LoggerModule],
      providers: [{ provide: dependencyToken, useValue: dependencyFn }],
    });

    expect(di.get(loggerToken)).toBe('log');
    expect(dependencyFn).toBeCalled();
  });

  it('imports', () => {
    const loggerToken = createToken<string>('logger');

    const LoggerModule = Module({
      providers: [{ provide: loggerToken, useValue: 'log' }],
    })(class LoggerModule {});

    const AppModule = Module({
      providers: [],
      imports: [LoggerModule],
    })(class AppModule {});

    const di = initContainer({
      modules: [AppModule],
    });

    expect(di.get(loggerToken)).toBe('log');
  });
});
