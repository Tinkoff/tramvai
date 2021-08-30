type TestingFrameworks = 'none' | 'jest';

const choices = ['none', 'jest'];

const testingFrameworkQuestion = (answer) => ({
  type: 'list' as const,
  name: 'testingFramework' as const,
  message: 'Выберите тестовый фреймворк для проекта',
  choices,
  when: () => !choices.includes(answer),
  default: 'jest' as const,
});

export { TestingFrameworks, testingFrameworkQuestion };
