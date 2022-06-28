import type { ExecutorContext } from '@nrwl/devkit';
import * as childProcess from 'child_process';
import * as util from 'util';
import * as path from 'path';
import type { BuildExecutorSchema } from './schema';

const exec = util.promisify(childProcess.exec);

// eslint-disable-next-line import/no-default-export
export default async function runExecutor(options: BuildExecutorSchema, context: ExecutorContext) {
  const { projectName, root, workspace } = context;

  if (!projectName) {
    throw new Error('Project name is not defined');
  }

  const projectConfiguration = workspace.projects[projectName];

  console.log(`build ${projectName}`);

  let channel: { stdout: string; stderr: string };

  try {
    channel = await exec('tramvai-build --for-publish --preserve-modules', {
      cwd: path.join(root, projectConfiguration.root),
    });
  } catch (e) {
    console.error(`failed ${projectName} log:\n`);
    console.error(e);
    return {
      success: false,
    };
  }

  if (channel.stderr) {
    // Эти warning'и попадает в stderr, но никак не мешают сборке
    if (
      !channel.stderr.includes('Generated an empty chunk') &&
      !channel.stderr.includes('ROLLUP_CHUNK_URL_') &&
      !channel.stderr.includes('but never used')
    ) {
      console.error(`failed ${projectName} log:\n`);
      console.error(channel.stderr);

      return {
        success: false,
      };
    }
  }

  console.log(`success ${projectName} log:\n`);
  console.log(channel.stdout);

  return {
    success: true,
  };
}
