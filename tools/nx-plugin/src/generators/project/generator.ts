import type { ProjectConfiguration, Tree } from '@nrwl/devkit';
import { getProjects, updateProjectConfiguration, writeJson, readJson } from '@nrwl/devkit';
import * as path from 'path';

const IGNORE_DIRS = ['/__integration__'];
const IGNORE_OUTPUT_DIRS = ['bin', 'src'];

const getOutputs = (config: ProjectConfiguration, packageJson: Record<string, any>) => {
  return [
    path.join(config.root, 'package.json'),
    ...packageJson.files
      .filter((entry: string) => !IGNORE_OUTPUT_DIRS.some((ignore) => entry.startsWith(ignore)))
      .map((entry: string) => path.join(config.root, entry)),
  ];
};

// eslint-disable-next-line import/no-default-export, func-names
export default async function (tree: Tree) {
  const projectsMap = await getProjects(tree);

  for (const [project, config] of projectsMap.entries()) {
    if (IGNORE_DIRS.some((dir) => config.root.includes(dir))) {
      return;
    }

    const packageJson = await readJson(tree, path.join(config.root, 'package.json'));
    const projectJsonPath = path.join(config.root, 'project.json');
    const srcPath = path.join(config.root, 'src');
    const hasSrcDir = tree.exists(srcPath);

    if (!tree.exists(projectJsonPath)) {
      await writeJson(tree, projectJsonPath, {
        name: packageJson.name,
        ...config,
        sourceRoot:
          (config.sourceRoot && config.sourceRoot.endsWith('/src')) || !hasSrcDir
            ? config.sourceRoot
            : `${config.sourceRoot}/src`,
        targets: {
          ...config.targets,
          ...(!packageJson.private && packageJson.files
            ? {
                'build-publish': {
                  outputs: getOutputs(config, packageJson),
                  executor: '@tramvai/nx-plugin:build',
                },
              }
            : {}),
        },
      });
    }

    if (packageJson.files && config.targets && 'build-publish' in config.targets) {
      await updateProjectConfiguration(tree, project, {
        ...config,
        targets: {
          ...config.targets,
          'build-publish': {
            ...config.targets['build-publish'],
            outputs: getOutputs(config, packageJson),
          },
        },
      });
    }
  }
}
