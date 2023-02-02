type TestingFrameworks = 'none' | 'jest';

const choices = ['none', 'jest'];

const testingFrameworkQuestion = (answer: string) => ({
  type: 'list' as const,
  name: 'testingFramework' as const,
  message: 'Choose a test framework for your project',
  choices,
  when: () => !choices.includes(answer),
  default: 'jest' as const,
});

export { TestingFrameworks, testingFrameworkQuestion };
