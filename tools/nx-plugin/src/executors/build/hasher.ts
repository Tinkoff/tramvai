import type { CustomHasher, Task, HasherContext } from '@nrwl/devkit';

const createTaskForProject = (project: string, target = 'fake'): Task => {
  return { id: `${project}-${target}`, target: { project, target }, overrides: {} };
};

export const buildHasher: CustomHasher = async (task: Task, context: HasherContext) => {
  // this is the default implementation for hashing that hashes project source and dependencies
  const projectHash = await context.hasher.hashTaskWithDepsAndContext(task);
  // add hash @tramvai/build to rerun builds on package change
  const buildHash = await context.hasher.hashSource(createTaskForProject('@tramvai/build'));
  // also rerun builds if @tramvai/nx-plugin has changed
  const nxPluginHash = await context.hasher.hashSource(createTaskForProject('@tramvai/nx-plugin'));

  const hash = await context.hasher.hashArray([projectHash.value, buildHash, nxPluginHash]);

  return {
    ...projectHash,
    value: hash,
  };
};

// eslint-disable-next-line import/no-default-export
export default buildHasher;
