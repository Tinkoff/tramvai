import util from 'util';
import childProcess from 'child_process';
import ora from 'ora';

const exec = util.promisify(childProcess.exec);

const addPaddingToString = (text: string) =>
  text
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');

export const packageHasVersion = async (packageName: string, version: string): Promise<boolean> => {
  const spinner = ora(`Checking is ${packageName} package has ${version} version`).start();

  try {
    const { stdout } = await exec(`npm view ${packageName}@${version} version`);
    const hasVersion = !!stdout.trim().replace('\n', '');
    spinner.stop();
    return hasVersion;
  } catch (e) {
    spinner.stop();
    // TODO: replace with logger from di
    console.log(`Checking failed with error:\n`);
    console.log(`${addPaddingToString(e.message)}`);
    console.log(`${addPaddingToString(e.stack.replace(e.message, ''))}\n`);
    return false;
  }
};
