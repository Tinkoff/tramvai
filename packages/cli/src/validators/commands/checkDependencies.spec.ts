import { sync as mockResolve } from 'resolve';
import type { Context } from '../../models/context';
import { checkDependencies } from './checkDependencies';

jest.mock('resolve', () => ({
  sync: jest.fn((name) => require.resolve(name)),
}));

describe('validators/checkDependencies', () => {
  const mockLog = jest.fn();

  const context = {
    logger: { event: mockLog } as any,
  } as Context;

  beforeEach(() => {
    mockLog.mockClear();
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

    (mockResolve as jest.Mock).mockImplementation((name, { basedir = '' } = {}) => {
      const stripped = name.replace('/package.json', '');

      if (basedir && mocked.has(stripped)) {
        return `/some/other/path/${stripped}`;
      }

      return `/some/${stripped}`;
    });

    expect(await checkDependencies(context)).toMatchInlineSnapshot(`
      Object {
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
        'Package webpack has duplicates in @tramvai/cli (/some/webpack) and in the process.cwd (/some/other/path/webpack)',
    });

    expect(mockLog).toHaveBeenCalledWith({
      type: 'warning',
      event: 'COMMAND:VALIDATE:DEPENDENCIES',
      message:
        'Package @babel/runtime has duplicates in @tramvai/cli (/some/@babel/runtime) and in the process.cwd (/some/other/path/@babel/runtime)',
    });

    expect(mockLog).toHaveBeenCalledWith({
      type: 'warning',
      event: 'COMMAND:VALIDATE:DEPENDENCIES',
      message:
        'Package postcss-modules-tilda has duplicates in @tramvai/cli (/some/postcss-modules-tilda) and in the process.cwd (/some/other/path/postcss-modules-tilda)',
    });
  });
});
