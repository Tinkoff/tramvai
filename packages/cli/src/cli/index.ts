import path from 'path';
import { resolvePackageManager, NpmPackageManager } from '@tinkoff/package-manager-wrapper';
import { CLI } from './CLI';
import { Analytics } from '../models/analytics';
import { Logger } from '../models/logger';
import { ConfigManager } from '../models/config';
import { initSentry } from '../utils/sentry';

import type { CommandMap } from '../models/command';

import buildCommand from '../commands/build/command';
import { StartCommand } from '../commands/start/command';
import lintCommand from '../commands/lint/command';
import taskCommand from '../commands/task/command';
import analyze from '../commands/analyze/command';
import generate from '../commands/generate/command';
import newCommand from '../commands/new/command';
import updateCommand from '../commands/update/command';
import addCommand from '../commands/add/command';
import { StaticCommand } from '../commands/static/command';
import { StartProdCommand } from '../commands/start-prod/command';
import { BenchmarkCommand } from '../commands/benchmark/command';

import npmInstallTask from '../tasks/npm-install';
import buildAppTask from '../tasks/build-app';
import type { TaskMap } from '../models/task';
import { getRootFile } from '../utils/getRootFile';
import { getTramvaiConfig } from '../utils/getTramvaiConfig';
import { syncJsonFile } from '../utils/syncJsonFile';

async function loadCommands(): Promise<CommandMap> {
  return [
    buildCommand,
    StartProdCommand,
    StartCommand,
    lintCommand,
    taskCommand,
    analyze,
    generate,
    newCommand,
    updateCommand,
    addCommand,
    StaticCommand,
    BenchmarkCommand,
  ];
}

async function loadTasks(): Promise<TaskMap> {
  return [npmInstallTask, buildAppTask];
}

const defaultPackageInfo = { name: 'init app', version: '0.0.1' };

export async function cliInitialized(cliArgs = process.argv) {
  const logger = new Logger();
  const sentry = initSentry();

  try {
    const commandContext = {
      command: cliArgs[2] || '',
      argv: cliArgs,
    };
    sentry.setContext('command', commandContext);
    const commandsMap = await loadCommands();
    const tasksMap = await loadTasks();

    const { content: packageInfo = defaultPackageInfo } = getRootFile<{
      name: string;
      version: string;
    }>('package.json');
    const { content: config } = getTramvaiConfig();

    const analytic = new Analytics({
      packageInfo,
      trackingCode: 'UA-122261674-1',
    });

    const configManager = new ConfigManager({ config, syncConfigFile: syncJsonFile });
    const packageManager = resolvePackageManager({ rootDir: process.cwd() });

    const cliRootDir = path.resolve(__dirname, '../', '../');
    const cliPackageManager = new NpmPackageManager({
      rootDir: cliRootDir,
    });

    const cliInstance = new CLI(
      commandsMap,
      tasksMap,
      logger,
      configManager,
      analytic,
      cliRootDir,
      cliPackageManager,
      packageManager
    );

    return await cliInstance.run(cliArgs);
  } catch (e: any) {
    logger.event({
      type: 'error',
      event: 'GLOBAL:ERROR',
      message: e.message || e,
    });
    console.error(e);
    sentry.captureException(e);

    throw e;
  } finally {
    await sentry.close();
  }
}
