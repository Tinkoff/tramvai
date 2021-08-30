if (process.env.JEST_MODE === 'watch') {
  if (!global.__tramvai_cli_mock) {
    throw new Error(
      'Cannot find @tramvai test setup, please, check your config for integration tests'
    );
  }
  jest.mock('@tramvai/cli', () => global.__tramvai_cli_mock);
}
