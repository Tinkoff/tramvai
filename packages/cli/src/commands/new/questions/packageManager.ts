type PackageManagers = 'npm' | 'yarn';

const choices = ['npm', 'yarn'];

const packageManagerQuestion = (answer) => ({
  type: 'list' as const,
  name: 'packageManager' as const,
  message: 'Выберите менеджер пакетов для проекта',
  choices,
  when: () => !choices.includes(answer),
  default: 'none' as const,
});

export { PackageManagers, packageManagerQuestion };
