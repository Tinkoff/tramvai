import { initContainer } from '../initContainer/initContainer';
import { createToken } from '../createToken/createToken';
import { declareModule } from './declareModule';

describe('declareModule', () => {
  it('providers', () => {
    const loggerToken = createToken<string>('logger');

    const LoggerModule = declareModule({
      name: 'logger',
      providers: [{ provide: loggerToken, useValue: 'log' }],
    });

    const di = initContainer({
      modules: [LoggerModule],
    });

    expect(di.get(loggerToken)).toBe('log');
  });

  it('imports', () => {
    const loggerToken = createToken<string>('logger');

    const LoggerModule = declareModule({
      name: 'logger',
      providers: [{ provide: loggerToken, useValue: 'log' }],
    });

    const AppModule = declareModule({
      name: 'app',
      imports: [LoggerModule],
    });

    const di = initContainer({
      modules: [AppModule],
    });

    expect(di.get(loggerToken)).toBe('log');
  });

  it('extend', () => {
    const loggerToken = createToken<string>('logger');

    const LoggerModule = declareModule({
      name: 'logger',
      providers: [{ provide: loggerToken, useValue: 'log' }],
      extend: {
        customForRoot: (value: string) => {
          return [{ provide: loggerToken, useValue: value }];
        },
      },
    });

    const di = initContainer({
      modules: [LoggerModule.customForRoot('custom log')],
    });

    expect(di.get(loggerToken)).toBe('custom log');
  });
});
