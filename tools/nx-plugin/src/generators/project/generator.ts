import type { Tree } from '@nrwl/devkit';
import { getProjects, updateProjectConfiguration, writeJson, readJson } from '@nrwl/devkit';
import * as path from 'path';

// eslint-disable-next-line import/no-default-export, func-names
export default async function (tree: Tree) {
  const projectsMap = await getProjects(tree);

  for (const [project, config] of projectsMap.entries()) {
    const packageJson = await readJson(tree, path.join(config.root, 'package.json'));
    const projectJsonPath = path.join(config.root, 'project.json');
    const srcPath = path.join(config.root, 'src');

    if (!tree.exists(projectJsonPath)) {
      await writeJson(tree, projectJsonPath, {});
    }

    const hasSrcDir = tree.exists(srcPath);

    await updateProjectConfiguration(tree, project, {
      name: packageJson.name,
      ...config,
      sourceRoot:
        (config.sourceRoot && config.sourceRoot.endsWith('/src')) || !hasSrcDir
          ? config.sourceRoot
          : `${config.sourceRoot}/src`,
      targets: {
        ...config.targets,
        ...(packageJson.private
          ? {}
          : {
              'build-publish': {
                outputs: [
                  path.join(config.root, 'lib'),
                  path.join(config.root, '__migrations__'),
                  path.join(config.root, 'package.json'),
                ],
                executor: '@tramvai/nx-plugin:build',
              },
            }),
      },
    });
  }
}
