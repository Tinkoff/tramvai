import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testRunner: 'jest-circus/runner',

  transform: {
    '\\.[jt]sx?$': [
      require.resolve('@swc-node/jest'),
      {
        experimentalDecorators: true,
        // enable inline sourcemap to be able to debug tests
        // based on https://github.com/swc-project/swc-node/issues/656
        sourcemap: 'inline',
        // force commonjs modules to prevent possible errors
        // https://github.com/swc-project/swc-node/issues/699
        module: 'commonjs',
      },
    ],
  },
  globalSetup: require.resolve('./globalSetup'),
  testEnvironment: require.resolve('./node-environment'),
  watchPlugins: [require.resolve('./watchPlugin')],
  setupFilesAfterEnv: [require.resolve('./setupCliMock')],
};

module.exports = config;
