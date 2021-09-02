import { runLintWithFixtures } from './utils/runLintWithFixtures';

const testCases = [
  {
    name: 'lint tramvai app files, configure tramvai plugin manually',
    type: 'tramvai',
    eslintConfig: {
      parser: 'babel-eslint',
      plugins: ['@tinkoff/tramvai'],
      rules: {
        '@tinkoff/tramvai/bundle-chunk-name': 'error',
      },
    },
  },
  {
    name: 'lint tramvai ts app files, use recommended tramvai plugin config',
    type: 'tramvai-typescript',
    eslintConfig: {
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@tinkoff/tramvai/recommended'],
    },
  },
];

describe('fixture eslint plugin test', () => {
  testCases.forEach((testCase) => {
    it(`check: ${testCase.name}`, () => {
      const result = runLintWithFixtures(testCase.type, testCase.eslintConfig);
      expect(result).toMatchSnapshot();
    });
  });
});
