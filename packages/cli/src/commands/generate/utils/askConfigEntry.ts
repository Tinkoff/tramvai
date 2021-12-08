import inquirer from 'inquirer';
import type { Context } from '../../../models/context';
import type { ConfigEntry } from '../../../typings/configEntry/common';

async function promptTarget(targets: string[]) {
  if (targets.length < 2) {
    return targets[0];
  }

  const { projectName } = await inquirer.prompt<{ projectName: string }>([
    {
      type: 'list' as const,
      name: 'projectName' as const,
      message: 'Select application',
      choices: targets,
      default: targets[0],
    },
  ]);

  return projectName;
}

export async function askConfigEntry(context: Context, target?: string): Promise<ConfigEntry> {
  const { projects } = context.config.get();
  const targets = Object.keys(projects);
  const targetPromise =
    target && targets.includes(target) ? Promise.resolve(target) : promptTarget(targets);
  const projectName = await targetPromise;

  return context.config.getProject(projectName);
}
