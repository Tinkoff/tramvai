import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import type { Context } from '../../models/context';
import type { CommandResult } from '../../models/command';
import type { Params } from './typings';
import { installDependencies } from './steps/installDependencies';
import { renderTemplate } from './steps/renderTemplate';
import { initializationGit } from './steps/initializationGit';
import type { ConfigEntry } from '../../typings/configEntry/common';
import type { Templates } from './questions/template';
import { templateQuestion } from './questions/template';
import type { PackageManagers } from './questions/packageManager';
import { packageManagerQuestion } from './questions/packageManager';
import type { TestingFrameworks } from './questions/testingFramework';
import { testingFrameworkQuestion } from './questions/testingFramework';

// ts не копирует файлы, так что шаблона не будет в lib директории =(
const getPathToTemplate = (template: Templates) =>
  path.resolve(__dirname, '../../../src/commands/new/templates', template);
const getPathToShared = () => path.resolve(__dirname, '../../../src/commands/new/templates/shared');
const getPathToBlock = () => path.resolve(__dirname, '../../../src/commands/new/templates/block');
const getPathToTestingFramework = (testingFramework: TestingFrameworks) =>
  path.resolve(__dirname, '../../../src/commands/new/templates/testing', testingFramework);

export default async function createNew(context: Context, params: Params): Promise<CommandResult> {
  const {
    name,
    template: inputTemplate,
    packageManager: inputPackageManager,
    testingFramework: inputTestingFramework,
  } = params;
  const directoryName = path.join(process.cwd(), name);
  const configEntry: ConfigEntry = {
    type: 'application',
    name,
    root: directoryName,
    commands: {},
  };

  const {
    template = inputTemplate,
    packageManager = inputPackageManager,
    testingFramework = inputTestingFramework,
  } = await inquirer.prompt<{
    template: Templates;
    packageManager: PackageManagers;
    testingFramework: TestingFrameworks;
  }>([
    templateQuestion(inputTemplate),
    packageManagerQuestion(inputPackageManager),
    testingFrameworkQuestion(inputTestingFramework),
  ]);

  const templateDir = getPathToTemplate(template);
  const sharedDir = getPathToShared();
  const blockDir = getPathToBlock();
  const isJest = testingFramework === 'jest';

  const blockDirectoryName = {
    monorepo: path.join('apps', name),
    multirepo: 'src',
  }[template];

  await renderTemplate(templateDir, directoryName, { configEntry, isJest });
  await renderTemplate(sharedDir, directoryName, { configEntry, isJest });
  await renderTemplate(blockDir, path.join(directoryName, blockDirectoryName), {
    configEntry,
    isJest,
  });

  if (testingFramework !== 'none') {
    await renderTemplate(getPathToTestingFramework(testingFramework), directoryName, {
      configEntry,
      isJest,
    });
  }

  await initializationGit(directoryName);
  await installDependencies(directoryName, packageManager, testingFramework);

  console.log(
    `\n\n Проект ${name} успешно создан. Для запуска проекта введите в терминале`,
    chalk.blue(`cd ${name} && npm start`)
  );

  return Promise.resolve({ status: 'ok' });
}
