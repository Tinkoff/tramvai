import { sync as mockResolve } from 'resolve';
import chalk from 'chalk';
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
    expect(await checkDependencies(context, {})).toEqual({
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

    expect(await checkDependencies(context, {})).toMatchInlineSnapshot(`
      {
        "message": "
      Found duplicates of some of the important dependencies for @tramvai/cli.
      That can lead to unexpected problems due to how commonjs resolves imported modules.

      To avoid possible problems it is preferably to do deduplication of the dependencies.
      To do it refer the docs - https://tramvai.dev/docs/mistakes/duplicate-dependencies#using-package-manager
      The exact list of important duplicates is above.
      Please note that duplicates above not necessarily will cause problems, but if you have some cryptic issue with the build consider fixing duplicates first
      ",
        "name": "checkDependencies",
        "status": "warning",
      }
    `);

    expect(mockLog).toHaveBeenCalledTimes(3);

    expect(mockLog).toHaveBeenCalledWith({
      type: 'warning',
      event: 'COMMAND:VALIDATE:DEPENDENCIES',
      message: `Package ${chalk.underline(
        'webpack'
      )} has duplicates in @tramvai/cli (/app/webpack/package.json) and in the process.cwd (/app/@tramvai/cli/webpack/package.json)`,
    });

    expect(mockLog).toHaveBeenCalledWith({
      type: 'warning',
      event: 'COMMAND:VALIDATE:DEPENDENCIES',
      message: `Package ${chalk.underline(
        '@babel/runtime'
      )} has duplicates in @tramvai/cli (/app/@babel/runtime/package.json) and in the process.cwd (/app/@tramvai/cli/@babel/runtime/package.json)`,
    });

    expect(mockLog).toHaveBeenCalledWith({
      type: 'warning',
      event: 'COMMAND:VALIDATE:DEPENDENCIES',
      message: `Package ${chalk.underline(
        'postcss-modules-tilda'
      )} has duplicates in @tramvai/cli (/app/postcss-modules-tilda/package.json) and in the process.cwd (/app/@tramvai/cli/postcss-modules-tilda/package.json)`,
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

    expect(await checkDependencies(context, {})).toMatchInlineSnapshot(`
      {
        "message": "
      Found duplicates of some of the important dependencies for @tramvai/cli.
      That can lead to unexpected problems due to how commonjs resolves imported modules.

      To avoid possible problems it is preferably to do deduplication of the dependencies.
      To do it refer the docs - https://tramvai.dev/docs/mistakes/duplicate-dependencies#using-package-manager
      The exact list of important duplicates is above.

      ",
        "name": "checkDependencies",
        "status": "error",
      }
    `);

    expect(mockLog).toHaveBeenCalledTimes(3);

    expect(mockLog).toHaveBeenCalledWith({
      type: 'error',
      event: 'COMMAND:VALIDATE:DEPENDENCIES',
      message: `Package ${chalk.underline(
        'webpack'
      )} has duplicates in @tramvai/cli (/app/webpack/package.json) and in the process.cwd (/app/@tramvai/cli/webpack/package.json)`,
    });

    expect(mockLog).toHaveBeenCalledWith({
      type: 'warning',
      event: 'COMMAND:VALIDATE:DEPENDENCIES',
      message: `Package ${chalk.underline(
        '@babel/runtime'
      )} has duplicates in @tramvai/cli (/app/@babel/runtime/package.json) and in the process.cwd (/app/@tramvai/cli/@babel/runtime/package.json)`,
    });

    expect(mockLog).toHaveBeenCalledWith({
      type: 'warning',
      event: 'COMMAND:VALIDATE:DEPENDENCIES',
      message: `Package ${chalk.underline(
        'postcss-modules-tilda'
      )} has duplicates in @tramvai/cli (/app/postcss-modules-tilda/package.json) and in the process.cwd (/app/@tramvai/cli/postcss-modules-tilda/package.json)`,
    });
  });
});
