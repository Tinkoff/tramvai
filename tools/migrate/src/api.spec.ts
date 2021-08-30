import { readJSON, pathExists, writeJSON, writeFile, readFile } from 'fs-extra';
import glob from 'fast-glob';
import { resolve } from 'path';
import { logger } from '@tinkoff/logger';
import { createApi } from './api';
import type { Api } from './types';

jest.mock('fs-extra');
jest.mock('fast-glob');
jest.mock('path');
jest.mock('@tinkoff/logger', () => {
  const mockDebug = jest.fn();
  const mockError = jest.fn();

  return {
    logger: () => ({
      debug: mockDebug,
      error: mockError,
    }),
  };
});

describe('@tramvai/tools-migrate', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Базовая работоспособность createApi, без трансформации', async () => {
    applyApiMocks();

    const migration = async (_: Api) => {};

    const { api, save } = await createApi('./');

    await migration(api);
    await save();

    expect(api.packageJSON).toStrictEqual({
      source: {},
      path: './package.json',
      originPath: './package.json',
    });

    expect(api.tramvaiJSON).toStrictEqual({
      source: {},
      path: './tramvai.json',
      originPath: './tramvai.json',
    });

    expect(writeJSON as any).toHaveBeenNthCalledWith(1, './package.json', {}, { spaces: 2 });
    expect(writeJSON as any).toHaveBeenNthCalledWith(2, './tramvai.json', {}, { spaces: 2 });
    expect(writeJSON as any).toHaveBeenCalledTimes(2);

    expect(writeFile as any).toHaveBeenCalledTimes(0);
  });

  it('Использование createApi для трансформации', async () => {
    applyApiMocks({
      packageJSON: {
        name: 'module',
        dependencies: {
          test: '1.0.0',
        },
      },
      tramvaiJSON: {
        projectsConfig: {
          test: false,
        },
      },
      files: [
        {
          name: 'a.ts',
          path: './a.ts',
          source: 'const foo = 1;',
        },
        {
          name: 'b.ts',
          path: './b.ts',
          source: 'const bar = 2;',
        },
      ],
    });

    const migration = async (api: Api) => {
      await api.transform(({ source }, { j }, { printOptions }) => {
        return j(source).findVariableDeclarators('foo').renameTo('bar').toSource(printOptions);
      });

      // eslint-disable-next-line no-param-reassign
      api.packageJSON.source.dependencies.test = '2.0.0';
      // eslint-disable-next-line no-param-reassign
      api.tramvaiJSON.source.projectsConfig.test = true;
    };

    const { api, save } = await createApi('./');

    await migration(api);
    await save();

    expect(writeJSON as any).toHaveBeenNthCalledWith(
      1,
      './package.json',
      {
        name: 'module',
        dependencies: {
          test: '2.0.0',
        },
      },
      { spaces: 2 }
    );
    expect(writeJSON as any).toHaveBeenNthCalledWith(
      2,
      './tramvai.json',
      {
        projectsConfig: {
          test: true,
        },
      },
      { spaces: 2 }
    );
    expect(writeJSON as any).toHaveBeenCalledTimes(2);

    expect(writeFile as any).toHaveBeenNthCalledWith(1, './a.ts', 'const bar = 1;');
    expect(writeFile as any).toHaveBeenCalledTimes(1);
  });

  it('Использование createApi для трансформации с ошибкой парсинга', async () => {
    applyApiMocks({
      files: [
        {
          name: 'a.ts',
          path: './a.ts',
          source: 'const foo = { test: 1, ;',
        },
        {
          name: 'b.ts',
          path: './b.ts',
          source: 'const foo = { test: 2 };',
        },
      ],
    });

    const migration = async (api: Api) => {
      await api.transform(({ source }, { j }, { printOptions }) => {
        return j(source).findVariableDeclarators('foo').renameTo('bar').toSource(printOptions);
      });
    };

    const { api, save } = await createApi('./');

    await migration(api);
    await save();

    expect(logger('test').error).toHaveBeenCalledWith(
      new SyntaxError('Unexpected token (1:23)'),
      'Ошибка при выполнении миграции для файла ./a.ts'
    );
    expect(writeFile as any).toHaveBeenNthCalledWith(1, './b.ts', 'const bar = { test: 2 };');
    expect(writeFile as any).toHaveBeenCalledTimes(1);
  });
});

function applyApiMocks({ packageJSON = {}, tramvaiJSON = {}, files = [] } = {}) {
  (readJSON as any).mockReturnValueOnce(Promise.resolve(packageJSON));
  (readJSON as any).mockReturnValueOnce(Promise.resolve(tramvaiJSON));
  (pathExists as any).mockReturnValueOnce(Promise.resolve(true));
  (resolve as any).mockReturnValueOnce('./package.json');
  (resolve as any).mockReturnValueOnce('./tramvai.json');

  const filenames = [];

  for (const file of files) {
    filenames.push(file.name);

    (resolve as any).mockReturnValueOnce(file.path);
    (readFile as any).mockReturnValueOnce(file.source);
  }

  (glob as any).mockReturnValueOnce(Promise.resolve(filenames));
}
