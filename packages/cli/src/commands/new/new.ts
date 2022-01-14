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
import type { Type } from './questions/type';
import { typeQuestion } from './questions/type';

// ts не копирует файлы, так что шаблона не будет в lib директории =(
const getPathToTemplate = (type: Type, template: Templates) =>
  path.resolve(__dirname, '../../../src/commands/new/templates', type, template);
const getPathToShared = () => path.resolve(__dirname, '../../../src/commands/new/templates/shared');
const getPathToBlock = (type: Type) =>
  path.resolve(__dirname, '../../../src/commands/new/templates', type, 'block');
const getPathToMonorepoBlock = () =>
  path.resolve(__dirname, '../../../src/commands/new/templates/monorepo-block');
const getPathToTestingFramework = (type: Type, testingFramework: TestingFrameworks) =>
  path.resolve(__dirname, '../../../src/commands/new/templates', type, 'testing', testingFramework);

export default async function createNew(context: Context, params: Params): Promise<CommandResult> {
  const {
    name,
    type: inputType,
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
    type = inputType,
    template = inputTemplate,
    packageManager = inputPackageManager,
    testingFramework = inputTestingFramework,
  } = await inquirer.prompt<{
    type: Type;
    template: Templates;
    packageManager: PackageManagers;
    testingFramework: TestingFrameworks;
  }>([
    typeQuestion(inputType),
    templateQuestion(inputTemplate),
    packageManagerQuestion(inputPackageManager),
    testingFrameworkQuestion(inputTestingFramework),
  ]);

  const templateDir = getPathToTemplate(type, template);
  const sharedDir = getPathToShared();
  const blockDir = getPathToBlock(type);
  const isNpm = packageManager === 'npm';
  const isJest = testingFramework === 'jest';

  const blockDirectoryName = {
    monorepo: path.join(type === 'app' ? 'apps' : 'child-apps', name),
    multirepo: 'src',
  }[template];

  await renderTemplate(templateDir, directoryName, { configEntry, isJest, isNpm });
  await renderTemplate(sharedDir, directoryName, { configEntry, isJest, isNpm });
  await renderTemplate(blockDir, path.join(directoryName, blockDirectoryName), {
    configEntry,
    isJest,
    isNpm,
  });
  if (template === 'monorepo') {
    const monorepoBlockDir = getPathToMonorepoBlock();

    await renderTemplate(monorepoBlockDir, path.join(directoryName, blockDirectoryName), {
      configEntry,
      isJest,
    });
  }

  if (testingFramework !== 'none') {
    await renderTemplate(getPathToTestingFramework(type, testingFramework), directoryName, {
      configEntry,
      isJest,
    });
  }

  await initializationGit(directoryName);
  await installDependencies({ localDir: directoryName, type, packageManager, testingFramework });

  console.log(
    `\n\n Project ${name} has been successfully created. To run the project, enter in the terminal`,
    chalk.blue(`cd ${name} && npm start`)
  );

  return Promise.resolve({ status: 'ok' });
}
