import execa from 'execa';
import chalk from 'chalk';
import ora from 'ora';
import type { PackageManagers } from '../questions/packageManager';
import type { TestingFrameworks } from '../questions/testingFramework';
import type { Type } from '../questions/type';

const DEPS: Record<Type, { dependencies: string[] }> = {
  app: {
    dependencies: [
      '@tramvai/core',
      '@tramvai/react',
      '@tramvai/state',
      '@tramvai/module-common',
      '@tramvai/module-error-interceptor',
      '@tramvai/module-render',
      '@tramvai/module-router',
      '@tramvai/module-seo',
      '@tramvai/module-server',
      '@tramvai/tokens-render',
      '@tramvai/tokens-router',
      '@tramvai/tokens-router',
      'react',
      'react-dom',
      'tslib@^2.0.3',
    ],
  },
  'child-app': {
    dependencies: [
      '@tramvai/core',
      '@tramvai/react',
      '@tramvai/state',
      '@tramvai/child-app-core',
      'react',
      'react-dom',
      'tslib@^2.0.3',
    ],
  },
};

const devDependencies = [
  '@tinkoff/eslint-config',
  '@tinkoff/eslint-config-react',
  '@tinkoff/eslint-plugin-tramvai',
  '@tramvai/cli',
  '@types/react',
  'postcss-custom-media',
  'postcss-custom-properties',
  'postcss-modules-values-replace',
  'postcss-nested',
  'husky@^4',
  'lint-staged',
  'prettier-config-tinkoff',
  'typescript',
];

const jestDevDependencies = [
  '@testing-library/react',
  '@testing-library/react-hooks',
  '@tramvai/test-unit',
  '@tramvai/test-react',
  '@tramvai/test-integration',
  '@tramvai/test-unit-jest',
  '@tramvai/test-integration-jest',
  '@types/jest',
  'jest',
  'jest-circus',
  'react-test-renderer',
];

const packagesInstallCommands = {
  npm: {
    deps: ['install', '--save', '--package-lock', '--legacy-peer-deps'],
    devDeps: ['install', '--save-dev', '--legacy-peer-deps'],
  },
  yarn: {
    deps: ['add'],
    devDeps: ['add', '--dev'],
  },
};

export async function installDependencies({
  localDir,
  type,
  packageManager,
  testingFramework,
}: {
  localDir: string;
  type: Type;
  packageManager: PackageManagers;
  testingFramework: TestingFrameworks;
}) {
  const spinner = ora({
    prefixText: `${chalk.blue('[START]')} Install dependencies`,
  }).start();

  const installCommands = packagesInstallCommands[packageManager];
  const options = { cwd: localDir, env: { SKIP_TRAMVAI_MIGRATIONS: 'true' } };

  await execa(packageManager, [...installCommands.deps, ...DEPS[type].dependencies], options);
  await execa(packageManager, [...installCommands.devDeps, ...devDependencies], options);

  if (testingFramework === 'jest') {
    await execa(packageManager, [...installCommands.devDeps, ...jestDevDependencies], options);
  }

  spinner.stop();
}
