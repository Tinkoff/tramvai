import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testRunner: 'jest-circus/runner',
  testEnvironment: 'node',

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

  moduleNameMapper: {
    '\\.(css|CSS)$': require.resolve('identity-obj-proxy'),
    '\\.(svg|png)$': require.resolve('./emptyModule.js'),
  },

  setupFiles: [require.resolve('./jsdom-fixes')],
};

module.exports = config;
