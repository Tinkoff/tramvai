import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testRunner: 'jest-circus/runner',
  testEnvironment: 'node',

  transform: {
    '\\.[jt]sx?$': [
      '@swc-node/jest',
      {
        experimentalDecorators: true,
      },
    ],
  },

  moduleNameMapper: {
    '\\.(css|CSS)$': require.resolve('identity-obj-proxy'),
    '\\.(svg|png)$': require.resolve('./emptyModule.js'),
  },
};

module.exports = config;
