import any from '@tinkoff/utils/array/any';

type Type = 'app' | 'child-app';

const choices = [
  {
    name: 'Standalone tramvai app',
    value: 'app',
  },
  {
    name: 'Microfrontend implemented by tramvai child-app',
    value: 'child-app',
  },
];

const typeQuestion = (answer) => ({
  type: 'list' as const,
  name: 'type' as const,
  message: 'Choose a type for your project',
  choices,
  when: () => !any<{ name: string; value: string }>((choice) => choice.value === answer)(choices),
  default: 'app' as const,
});

export { Type, typeQuestion };
