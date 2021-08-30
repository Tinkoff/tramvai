import any from '@tinkoff/utils/array/any';

type Templates = 'multirepo' | 'monorepo';

const choices = [
  {
    name: 'Одно приложение на репозиторий',
    value: 'multirepo',
  },
  {
    name: 'Поддержка множества приложений в одном репозитории',
    value: 'monorepo',
  },
];

const templateQuestion = (answer) => ({
  type: 'list' as const,
  name: 'template' as const,
  message: 'Выберите шаблон для проекта',
  choices,
  when: () => !any<{ name: string; value: string }>((choice) => choice.value === answer)(choices),
  default: 'multirepo' as const,
});

export { Templates, templateQuestion };
