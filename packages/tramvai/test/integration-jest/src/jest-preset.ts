import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testRunner: 'jest-circus/runner',
  // TODO: из-за этого чаще падают тесты в ci по таймаутам
  // globalSetup: require.resolve('./globalSetup'),
  // globalTeardown: require.resolve('./globalTeardown'),
  testEnvironment: require.resolve('./node-environment'),
  watchPlugins: [require.resolve('./watchPlugin')],
  setupFilesAfterEnv: [require.resolve('./setupCliMock')],
  timers: 'real',
};

module.exports = config;
