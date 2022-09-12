import { sync as mockResolve } from 'resolve';
import type { Context } from '../../models/context';
import { checkDependencies } from './checkDependencies';

jest.mock('resolve', () => ({
  sync: jest.fn((name) => require.resolve(name)),
}));

const mockPackage = (name: string, mockRootVersion: string, mockCliVersion: string) => {
  jest.mock(
    `/app/${name}/package.json`,
    () => {
      return { version: mockRootVersion };
    },
    { virtual: true }
  );

  jest.mock(
    `/app/@tramvai/cli/${name}/package.json`,
    () => {
      return { version: mockCliVersion };
    },
    { virtual: true }
  );
};

describe('validators/checkDependencies', () => {
  const mockLog = jest.fn();

  const context = {
    logger: { event: mockLog } as any,
  } as Context;

  beforeEach(() => {
    mockLog.mockClear();
    jest.resetModules();
    (mockResolve as jest.Mock).mockClear();
  });

  it('should return ok when all dependecies good', async () => {
    expect(await checkDependencies(context)).toEqual({
      name: 'checkDependencies',
      status: 'ok',
    });
  });

  it('should log dependencies with duplicates', async () => {
    const mocked = new Set(['webpack', 'ajv', 'fuzzy', '@babel/runtime', 'postcss-modules-tilda']);

    mockPackage('webpack', '4.5.8', '4.3.2');
    mockPackage('@babel/runtime', '7.3.9', '7.2.0');
    mockPackage('postcss-modules-tilda', '4.3.2', '3.0.0-prerelease.4');

    (mockResolve as jest.Mock).mockImplementation((name, { basedir = '' } = {}) => {
      const stripped = name.replace('/package.json', '');

      if (basedir && mocked.has(stripped)) {
        return `/app/@tramvai/cli/${name}`;
      }

      return `/app/${name}`;
    });

    expect(await checkDependencies(context)).toMatchInlineSnapshot(`
      {
        "message": "
      Некоторые важные пакеты необходимые для работы @tramvai/cli дублируются,
      что может привести к неочевидным багам и проблемам из-за особенностей commonjs по поиску импортируемых модулей.

      Во избежании возможных проблем желательно провести дедупликацию таких пакетов.
      Сам список проблемных пакетов выведен выше.
      Для дедупликации можно предпринять следующие шаги (после каждого шага можно перезапустить сборку для проверки):
          1. Вызвать команды дедупликации своего пакетного менеджера: npm dedupe; yarn-deduplicate
          2. Пересобрать lock файл полностью (удалить node_modules, удалить package-lock.json или yarn.lock и запустить установку пакетов)
          3. Если ничего из выше не помогло, то проверить какие пакеты тянут в сборку проблемные пакеты и постараться реорганизовать работу с ними (npm ls; yarn why)
          4. Возможно дубликаты ничего не ломают и их можно не трогать, если проблемы всё же есть и их не получается решить обратитесь в чат #tramvai с описанием проблемы
                  ",
        "name": "checkDependencies",
        "status": "warning",
      }
    `);

    expect(mockLog).toHaveBeenCalledTimes(3);

    expect(mockLog).toHaveBeenCalledWith({
      type: 'warning',
      event: 'COMMAND:VALIDATE:DEPENDENCIES',
      message:
        'Package webpack has duplicates in @tramvai/cli (/app/webpack/package.json) and in the process.cwd (/app/@tramvai/cli/webpack/package.json)',
    });

    expect(mockLog).toHaveBeenCalledWith({
      type: 'warning',
      event: 'COMMAND:VALIDATE:DEPENDENCIES',
      message:
        'Package @babel/runtime has duplicates in @tramvai/cli (/app/@babel/runtime/package.json) and in the process.cwd (/app/@tramvai/cli/@babel/runtime/package.json)',
    });

    expect(mockLog).toHaveBeenCalledWith({
      type: 'warning',
      event: 'COMMAND:VALIDATE:DEPENDENCIES',
      message:
        'Package postcss-modules-tilda has duplicates in @tramvai/cli (/app/postcss-modules-tilda/package.json) and in the process.cwd (/app/@tramvai/cli/postcss-modules-tilda/package.json)',
    });
  });

  it('should error for major diffs', async () => {
    const mocked = new Set(['webpack', 'ajv', 'fuzzy', '@babel/runtime', 'postcss-modules-tilda']);

    mockPackage('webpack', '4.5.8', '5.3.2');
    mockPackage('@babel/runtime', '7.3.9', '7.2.0');
    mockPackage('postcss-modules-tilda', '4.3.2', '3.0.0-prerelease.4');

    (mockResolve as jest.Mock).mockImplementation((name, { basedir = '' } = {}) => {
      const stripped = name.replace('/package.json', '');

      if (basedir && mocked.has(stripped)) {
        return `/app/@tramvai/cli/${name}`;
      }

      return `/app/${name}`;
    });

    expect(await checkDependencies(context)).toMatchInlineSnapshot(`
      {
        "message": "
      Некоторые важные пакеты необходимые для работы @tramvai/cli дублируются,
      что может привести к неочевидным багам и проблемам из-за особенностей commonjs по поиску импортируемых модулей.

      Во избежании возможных проблем желательно провести дедупликацию таких пакетов.
      Сам список проблемных пакетов выведен выше.
      Для дедупликации можно предпринять следующие шаги (после каждого шага можно перезапустить сборку для проверки):
          1. Вызвать команды дедупликации своего пакетного менеджера: npm dedupe; yarn-deduplicate
          2. Пересобрать lock файл полностью (удалить node_modules, удалить package-lock.json или yarn.lock и запустить установку пакетов)
          3. Если ничего из выше не помогло, то проверить какие пакеты тянут в сборку проблемные пакеты и постараться реорганизовать работу с ними (npm ls; yarn why)
          4. Возможно дубликаты ничего не ломают и их можно не трогать, если проблемы всё же есть и их не получается решить обратитесь в чат #tramvai с описанием проблемы
                  ",
        "name": "checkDependencies",
        "status": "error",
      }
    `);

    expect(mockLog).toHaveBeenCalledTimes(3);

    expect(mockLog).toHaveBeenCalledWith({
      type: 'error',
      event: 'COMMAND:VALIDATE:DEPENDENCIES',
      message:
        'Package webpack has duplicates in @tramvai/cli (/app/webpack/package.json) and in the process.cwd (/app/@tramvai/cli/webpack/package.json)',
    });

    expect(mockLog).toHaveBeenCalledWith({
      type: 'warning',
      event: 'COMMAND:VALIDATE:DEPENDENCIES',
      message:
        'Package @babel/runtime has duplicates in @tramvai/cli (/app/@babel/runtime/package.json) and in the process.cwd (/app/@tramvai/cli/@babel/runtime/package.json)',
    });

    expect(mockLog).toHaveBeenCalledWith({
      type: 'warning',
      event: 'COMMAND:VALIDATE:DEPENDENCIES',
      message:
        'Package postcss-modules-tilda has duplicates in @tramvai/cli (/app/postcss-modules-tilda/package.json) and in the process.cwd (/app/@tramvai/cli/postcss-modules-tilda/package.json)',
    });
  });
});
