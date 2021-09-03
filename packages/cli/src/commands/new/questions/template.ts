import any from '@tinkoff/utils/array/any';

type Templates = 'multirepo' | 'monorepo';

const choices = [
  {
    name: 'One application per repository',
    value: 'multirepo',
  },
  {
    name: 'Support for multiple applications in one repository',
    value: 'monorepo',
  },
];

const templateQuestion = (answer) => ({
  type: 'list' as const,
  name: 'template' as const,
  message: 'Choose a template for your project',
  choices,
  when: () => !any<{ name: string; value: string }>((choice) => choice.value === answer)(choices),
  default: 'multirepo' as const,
});

export { Templates, templateQuestion };
