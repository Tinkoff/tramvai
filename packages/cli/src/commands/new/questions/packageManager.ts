type PackageManagers = 'npm' | 'yarn';

const choices = ['npm', 'yarn'];

const packageManagerQuestion = (answer: string) => ({
  type: 'list' as const,
  name: 'packageManager' as const,
  message: 'Choose a package manager for the project',
  choices,
  when: () => !choices.includes(answer),
  default: 'none' as const,
});

export { PackageManagers, packageManagerQuestion };
