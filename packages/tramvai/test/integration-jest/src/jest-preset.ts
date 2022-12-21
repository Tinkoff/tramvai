import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testRunner: 'jest-circus/runner',

  transform: {
    '\\.[jt]sx?$': [
      require.resolve('@swc-node/jest'),
      {
        experimentalDecorators: true,
      },
    ],
  },
  globalSetup: require.resolve('./globalSetup'),
  testEnvironment: require.resolve('./node-environment'),
  watchPlugins: [require.resolve('./watchPlugin')],
  setupFilesAfterEnv: [require.resolve('./setupCliMock')],
};

module.exports = config;
