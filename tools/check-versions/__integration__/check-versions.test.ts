import { resolve } from 'path';
import { logger } from '@tinkoff/logger';
import { run } from '../src/index';

jest.mock('@tinkoff/logger', () => {
  const info = jest.fn();
  const warn = jest.fn();
  const error = jest.fn();
  const enable = jest.fn();

  const loggerMock = () => {
    return {
      info,
      warn,
      error,
    };
  };

  loggerMock.enable = enable;

  return {
    logger: loggerMock,
  };
});

describe('[tools/check-versions] integration test', () => {
  const { info, warn, error } = logger('test');
  const mockInfo = info as jest.Mock;
  const mockWarn = warn as jest.Mock;
  const mockError = error as jest.Mock;
  let processExitMock;

  beforeEach(() => {
    mockInfo.mockClear();
    mockWarn.mockClear();
    mockError.mockClear();
  });

  beforeAll(() => {
    processExitMock = jest.spyOn(process, 'exit').mockImplementation((code?: number) => {
      throw Error(String(code));
    });
  });

  afterEach(() => {
    delete process.env.INIT_CWD;
  });

  afterAll(() => {
    processExitMock.mockRestore();
  });

  it('should just pass for right versions v1', async () => {
    process.env.INIT_CWD = resolve(__dirname, '__fixtures__', 'app-right-deps-1');

    await run();

    expect(mockError).not.toHaveBeenCalled();
    expect(mockInfo).toHaveBeenCalledWith('Проверка версий tramvai модулей в приложении');
    expect(mockInfo).toHaveBeenCalledWith('С версиями tramvai все ок!');
  });

  it('should just pass for right versions v2', async () => {
    process.env.INIT_CWD = resolve(__dirname, '__fixtures__', 'app-right-deps-2');

    await run();

    expect(mockError).not.toHaveBeenCalled();
    expect(mockInfo).toHaveBeenCalledWith('Проверка версий tramvai модулей в приложении');
    expect(mockInfo).toHaveBeenCalledWith('С версиями tramvai все ок!');
  });

  it('should just pass for right versions with different alpha version', async () => {
    process.env.INIT_CWD = resolve(__dirname, '__fixtures__', 'app-right-deps-prerelease');

    await run();

    expect(mockError).not.toHaveBeenCalled();
    expect(mockInfo).toHaveBeenCalledWith('Проверка версий tramvai модулей в приложении');
    expect(mockInfo).toHaveBeenCalledWith('С версиями tramvai все ок!');
  });

  it('should throw error for wrong versions, @tramvai/core have highest version', async () => {
    process.env.INIT_CWD = resolve(__dirname, '__fixtures__', 'app-wrong-deps-1');

    await expect(run()).rejects.toThrow();

    expect(mockInfo).toHaveBeenCalledWith('Проверка версий tramvai модулей в приложении');
    expect(mockError.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Версии модулей tramvai не совпадают!

        Необходимо сделать следующее:
          1. Проверить package.json и поправить версии пакетов на фиксированную версию \\"0.5.3\\" для пакетов из списка ниже
          2. Обновить лок-файл командой \\"npm i\\" или \\"yarn\\"
          3. Если после обновления ошибка всё равно проявляется - проверить лок-файл на наличие неправильных версий и возможно пересобрать лок-файл
          4. Если при обновлении какая-то версия пакета не находится, то скорее всего это устаревший пакет и стоит поискать информацию о таком пакете в https://tramvai.dev/docs/releases/migration

        Список пакетов для обновления:
      "
    `);
    expect(mockError).toHaveBeenCalledWith('\t\t@tramvai/module-common');
    expect(mockError).toHaveBeenCalledWith('\t\t@tramvai/module-router');
    expect(mockError).toHaveBeenCalledWith('\t\t@tramvai/state');
  });

  it('should throw error for wrong versions, @tramvai/core have lower version', async () => {
    process.env.INIT_CWD = resolve(__dirname, '__fixtures__', 'app-wrong-deps-2');

    await expect(run()).rejects.toThrow();

    expect(mockInfo).toHaveBeenCalledWith('Проверка версий tramvai модулей в приложении');
    expect(mockError.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Версии модулей tramvai не совпадают!

        Необходимо сделать следующее:
          1. Проверить package.json и поправить версии пакетов на фиксированную версию \\"0.8.0\\" для пакетов из списка ниже
          2. Обновить лок-файл командой \\"npm i\\" или \\"yarn\\"
          3. Если после обновления ошибка всё равно проявляется - проверить лок-файл на наличие неправильных версий и возможно пересобрать лок-файл
          4. Если при обновлении какая-то версия пакета не находится, то скорее всего это устаревший пакет и стоит поискать информацию о таком пакете в https://tramvai.dev/docs/releases/migration

        Список пакетов для обновления:
      "
    `);
    expect(mockError).toHaveBeenCalledWith('\t\t@tramvai/core');
    expect(mockError).toHaveBeenCalledWith('\t\t@tramvai/module-common');
    expect(mockError).toHaveBeenCalledWith('\t\t@tramvai/module-router');
  });

  it('should throw error for wrong versions, @tramvai/state have lower prerelease version', async () => {
    process.env.INIT_CWD = resolve(__dirname, '__fixtures__', 'app-wrong-deps-prerelease');

    await expect(run()).rejects.toThrow();

    expect(mockInfo).toHaveBeenCalledWith('Проверка версий tramvai модулей в приложении');

    expect(mockError.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Версии модулей tramvai не совпадают!

        Необходимо сделать следующее:
          1. Проверить package.json и поправить версии пакетов на фиксированную версию \\"0.4.2\\" для пакетов из списка ниже
          2. Обновить лок-файл командой \\"npm i\\" или \\"yarn\\"
          3. Если после обновления ошибка всё равно проявляется - проверить лок-файл на наличие неправильных версий и возможно пересобрать лок-файл
          4. Если при обновлении какая-то версия пакета не находится, то скорее всего это устаревший пакет и стоит поискать информацию о таком пакете в https://tramvai.dev/docs/releases/migration

        Список пакетов для обновления:
      "
    `);
    expect(mockError).toHaveBeenCalledWith('\t\t@tramvai/state');
  });
});
