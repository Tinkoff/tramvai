module.exports = {
  preset: '@tramvai/test-integration-jest',

  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },

  testMatch: ['**/__integration__/**/?(*.)+(test).[jt]s?(x)'],
};
