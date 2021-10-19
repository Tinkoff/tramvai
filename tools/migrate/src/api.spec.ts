import { readJSON, pathExists, writeJSON, writeFile, readFile } from 'fs-extra';
import glob from 'fast-glob';
import { resolve } from 'path';
import { logger } from '@tinkoff/logger';
import { resolvePackageManager } from '@tinkoff/package-manager-wrapper';
import { createApi } from './api';
import type { Api } from './types';

jest.mock('fs-extra');
jest.mock('fast-glob');
jest.mock('path');

jest.mock('@tinkoff/package-manager-wrapper', () => {
  return {
    resolvePackageManager: jest.fn(() => {
      console.log('call');
      return {
        install: jest.fn(),
      };
    }),
  };
});
jest.mock('@tinkoff/logger', () => {
  const mockDebug = jest.fn();
  const mockWarn = jest.fn();
  const mockError = jest.fn();

  return {
    logger: () => ({
      debug: mockDebug,
      warn: mockWarn,
      error: mockError,
    }),
  };
});

describe('@tramvai/tools-migrate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should do not save anything when there were no changes', async () => {
    applyApiMocks();

    const migration = async (_: Api) => {};

    const { api, save } = await createApi('./');

    await migration(api);
    await save();

    expect(api.packageJSON).toStrictEqual({
      source: {},
      originSource: {},
      path: './package.json',
      originPath: './package.json',
    });

    expect(api.tramvaiJSON).toStrictEqual({
      source: {},
      originSource: {},
      path: './tramvai.json',
      originPath: './tramvai.json',
    });

    expect(writeJSON as jest.Mock).toHaveBeenCalledTimes(0);
    expect(resolvePackageManager).not.toHaveBeenCalled();
    expect(writeFile as jest.Mock).toHaveBeenCalledTimes(0);
  });

  it('should work in base case', async () => {
    applyApiMocks();

    const migration = async ({ packageJSON, tramvaiJSON }: Api) => {
      // eslint-disable-next-line no-param-reassign
      packageJSON.source.test = true;
      // eslint-disable-next-line no-param-reassign
      (tramvaiJSON.source as any).path = 'transform';
    };

    const { api, save } = await createApi('./');

    await migration(api);
    await save();

    expect(api.packageJSON).toStrictEqual({
      source: {
        test: true,
      },
      originSource: {},
      path: './package.json',
      originPath: './package.json',
    });

    expect(api.tramvaiJSON).toStrictEqual({
      source: {
        path: 'transform',
      },
      originSource: {},
      path: './tramvai.json',
      originPath: './tramvai.json',
    });

    expect(writeJSON as jest.Mock).toHaveBeenCalledTimes(2);
    expect(writeJSON as jest.Mock).toHaveBeenNthCalledWith(
      1,
      './package.json',
      { test: true },
      { spaces: 2 }
    );
    expect(writeJSON as jest.Mock).toHaveBeenNthCalledWith(
      2,
      './tramvai.json',
      { path: 'transform' },
      { spaces: 2 }
    );
    expect(resolvePackageManager).not.toHaveBeenCalled();

    expect(writeFile as jest.Mock).toHaveBeenCalledTimes(0);
  });

  it('should save source file transforms', async () => {
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

      if (!api.packageJSON.source.dependencies) {
        // eslint-disable-next-line no-param-reassign
        api.packageJSON.source.dependencies = {};
      }

      // eslint-disable-next-line no-param-reassign
      api.packageJSON.source.dependencies.test = '2.0.0';
      // eslint-disable-next-line no-param-reassign
      api.tramvaiJSON.source.projectsConfig.test = true;
    };

    const { api, save } = await createApi('./');

    await migration(api);
    await save();

    expect(writeJSON as jest.Mock).toHaveBeenNthCalledWith(
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
    expect(writeJSON as jest.Mock).toHaveBeenNthCalledWith(
      2,
      './tramvai.json',
      {
        projectsConfig: {
          test: true,
        },
      },
      { spaces: 2 }
    );

    expect(writeJSON as jest.Mock).toHaveBeenCalledTimes(2);
    expect(resolvePackageManager).toHaveBeenCalled();

    expect(writeFile as jest.Mock).toHaveBeenNthCalledWith(1, './a.ts', 'const bar = 1;');
    expect(writeFile as jest.Mock).toHaveBeenCalledTimes(1);
  });

  it('should work with errors on transformation', async () => {
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
    expect(writeFile as jest.Mock).toHaveBeenNthCalledWith(1, './b.ts', 'const bar = { test: 2 };');
    expect(writeFile as jest.Mock).toHaveBeenCalledTimes(1);
  });
});

function applyApiMocks({
  packageJSON = {},
  tramvaiJSON = {},
  files = [],
}: {
  packageJSON?: Record<string, any>;
  tramvaiJSON?: Record<string, any>;
  files?: { name: string; path: string; source: string }[];
} = {}) {
  (readJSON as jest.Mock).mockReturnValueOnce(Promise.resolve(packageJSON));
  (readJSON as jest.Mock).mockReturnValueOnce(Promise.resolve(tramvaiJSON));
  (pathExists as jest.Mock).mockReturnValueOnce(Promise.resolve(true));
  (resolve as jest.Mock).mockReturnValueOnce('./package.json');
  (resolve as jest.Mock).mockReturnValueOnce('./tramvai.json');

  const filenames = [];

  for (const file of files) {
    filenames.push(file.name);

    (resolve as jest.Mock).mockReturnValueOnce(file.path);
    (readFile as jest.Mock).mockReturnValueOnce(file.source);
  }

  ((glob as any) as jest.Mock).mockReturnValueOnce(Promise.resolve(filenames));
}
