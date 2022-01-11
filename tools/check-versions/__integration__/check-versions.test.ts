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
    expect(mockInfo).toHaveBeenCalledWith(
      'Checking the versions of tramvai modules in the application'
    );
    expect(mockInfo).toHaveBeenCalledWith('The tramvai versions are okay!');
  });

  it('should just pass for right versions v2', async () => {
    process.env.INIT_CWD = resolve(__dirname, '__fixtures__', 'app-right-deps-2');

    await run();

    expect(mockError).not.toHaveBeenCalled();
    expect(mockInfo).toHaveBeenCalledWith(
      'Checking the versions of tramvai modules in the application'
    );
    expect(mockInfo).toHaveBeenCalledWith('The tramvai versions are okay!');
  });

  it('should just pass for right versions with different alpha version', async () => {
    process.env.INIT_CWD = resolve(__dirname, '__fixtures__', 'app-right-deps-prerelease');

    await run();

    expect(mockError).not.toHaveBeenCalled();
    expect(mockInfo).toHaveBeenCalledWith(
      'Checking the versions of tramvai modules in the application'
    );
    expect(mockInfo).toHaveBeenCalledWith('The tramvai versions are okay!');
  });

  it('should throw error for wrong versions, @tramvai/core have highest version', async () => {
    process.env.INIT_CWD = resolve(__dirname, '__fixtures__', 'app-wrong-deps-1');

    await expect(run()).rejects.toThrow();

    expect(mockInfo).toHaveBeenCalledWith(
      'Checking the versions of tramvai modules in the application'
    );
    expect(mockError.mock.calls[0][0]).toMatchInlineSnapshot(`
"The versions of the tramvai modules do not match!

  It is necessary to do the following:
    1. Check package.json and set the package versions to a fixed version \\"0.5.3\\" for the packages listed below
    2. Update the lock file with the command \\"npm i\\" or \\"yarn\\"
    3. If after upgrading the error still occurs - check the lock file for incorrect versions and maybe rebuild the lock file
    4. If there is no version of a package when you upgrade, it is probably an outdated package and you should look up for the replacement at https://tramvai.dev/docs/releases/migration.

  List of packages to update:
"
`);
    expect(mockError).toHaveBeenCalledWith('\t\t@tramvai/module-common');
    expect(mockError).toHaveBeenCalledWith('\t\t@tramvai/module-router');
    expect(mockError).toHaveBeenCalledWith('\t\t@tramvai/state');
  });

  it('should throw error for wrong versions, @tramvai/core have lower version', async () => {
    process.env.INIT_CWD = resolve(__dirname, '__fixtures__', 'app-wrong-deps-2');

    await expect(run()).rejects.toThrow();

    expect(mockInfo).toHaveBeenCalledWith(
      'Checking the versions of tramvai modules in the application'
    );
    expect(mockError.mock.calls[0][0]).toMatchInlineSnapshot(`
"The versions of the tramvai modules do not match!

  It is necessary to do the following:
    1. Check package.json and set the package versions to a fixed version \\"0.8.0\\" for the packages listed below
    2. Update the lock file with the command \\"npm i\\" or \\"yarn\\"
    3. If after upgrading the error still occurs - check the lock file for incorrect versions and maybe rebuild the lock file
    4. If there is no version of a package when you upgrade, it is probably an outdated package and you should look up for the replacement at https://tramvai.dev/docs/releases/migration.

  List of packages to update:
"
`);
    expect(mockError).toHaveBeenCalledWith('\t\t@tramvai/core');
    expect(mockError).toHaveBeenCalledWith('\t\t@tramvai/module-common');
    expect(mockError).toHaveBeenCalledWith('\t\t@tramvai/module-router');
  });

  it('should throw error for wrong versions, @tramvai/state have lower prerelease version', async () => {
    process.env.INIT_CWD = resolve(__dirname, '__fixtures__', 'app-wrong-deps-prerelease');

    await expect(run()).rejects.toThrow();

    expect(mockInfo).toHaveBeenCalledWith(
      'Checking the versions of tramvai modules in the application'
    );

    expect(mockError.mock.calls[0][0]).toMatchInlineSnapshot(`
"The versions of the tramvai modules do not match!

  It is necessary to do the following:
    1. Check package.json and set the package versions to a fixed version \\"0.4.2\\" for the packages listed below
    2. Update the lock file with the command \\"npm i\\" or \\"yarn\\"
    3. If after upgrading the error still occurs - check the lock file for incorrect versions and maybe rebuild the lock file
    4. If there is no version of a package when you upgrade, it is probably an outdated package and you should look up for the replacement at https://tramvai.dev/docs/releases/migration.

  List of packages to update:
"
`);
    expect(mockError).toHaveBeenCalledWith('\t\t@tramvai/state');
  });
});
