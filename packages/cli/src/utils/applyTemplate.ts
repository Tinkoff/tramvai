import glob from 'glob';
import path from 'path';
import fse from 'fs-extra';
import handlebars from 'handlebars';
import chalk from 'chalk';

export interface ApplyTemplateResult {
  /** Whether a fatal error occurred */
  error?: boolean;
  /** Number of files/folders processed successfully (not counting warnings) */
  processed?: number;
  /** Number of files/folders for which processing was unsuccessful */
  warnings?: number;
}

const replaceHbs = (pathFile: string) => pathFile.replace(/\.hbs$/, '');

/**
 * Apply a template to a project directory. If the directory doesn't exist, it will be created.
 * If the directory exists, contents will be merged with the files/folders from the template.
 *
 * @param templateDir Path to the directory containing the template
 * @param projectDir Path to the destination project to create/update
 * @param templateData If the template contains any handlebars files, this will be passed to them
 * when compiling
 * @returns Object indicating whether the template application was successful
 */

function transformOutputPath(rawPath): string {
  return rawPath
    .split('/')
    .map((filename) => {
      // dotfiles are ignored when published to npm, therefore in templates
      // we need to use underscore instead (e.g. "_gitignore")
      if (filename.charAt(0) === '_' && filename.charAt(1) !== '_') {
        return `.${filename.slice(1)}`;
      }
      if (filename.charAt(0) === '_' && filename.charAt(1) === '_') {
        return `${filename.slice(1)}`;
      }
      return filename;
    })
    .join('/');
}

function writeHbsFile(inputFile: string, outputFile: string, templateData?: any) {
  // Intentionally allowing exceptions to propagate and be handled by caller
  const fileContents = fse.readFileSync(inputFile).toString();
  const template = handlebars.compile(fileContents);
  const results = template(templateData);
  fse.outputFileSync(replaceHbs(outputFile), results);
}

function processFileFromTemplate(
  templateFile: string,
  templateDir: string,
  projectDir: string,
  templateData?: any
): boolean {
  const inputFilePath = path.join(templateDir, templateFile);
  const outputFilePath = path.join(projectDir, transformOutputPath(templateFile));

  if (!fse.existsSync(inputFilePath)) {
    console.warn(`File ${inputFilePath} does not exist. Skipping.`);
    return false;
  }

  try {
    const inputStat = fse.statSync(inputFilePath);
    const inputIsDir = inputStat.isDirectory();

    if (fse.existsSync(outputFilePath)) {
      const outputIsDir = fse.statSync(outputFilePath).isDirectory();
      if (inputIsDir !== outputIsDir) {
        console.warn(
          `Template ${templateFile} is a ${inputIsDir ? 'directory' : 'file'} ` +
            `in source but a ${outputIsDir ? 'directory' : 'file'} in destination. Skipping.`
        );
        return false;
      }
    }

    if (inputIsDir) {
      fse.mkdirpSync(outputFilePath);
    } else if (path.extname(templateFile) === '.hbs') {
      writeHbsFile(inputFilePath, outputFilePath, templateData);
    } else {
      fse.copySync(inputFilePath, outputFilePath, { overwrite: true });
    }
  } catch (ex) {
    console.warn(`Error processing template ${templateFile} (skipping): ${ex}`);
    return false;
  }
  return true;
}

export function applyTemplate(
  templateDir: string,
  projectDir: string,
  templateData?: any
): ApplyTemplateResult {
  let templateFiles: string[];
  try {
    templateFiles = glob.sync('**/*', {
      cwd: templateDir,
      dot: true,
      nodir: true,
      ignore: ['node_modules/**/*', '**/.DS_Store'],
    });
  } catch (ex) {
    console.error(`Error finding template files under ${templateDir}: ${ex}`);
    return { error: true, processed: 0, warnings: 0 };
  }

  if (!fse.existsSync(projectDir)) {
    try {
      fse.mkdirpSync(projectDir);
    } catch (ex) {
      console.error(`Couldn't create directory ${projectDir}: ${ex}`);
      return { error: true, processed: 0, warnings: 0 };
    }
  }

  let processed = 0;
  let warnings = 0;
  templateFiles.forEach((templateFile) => {
    if (processFileFromTemplate(templateFile, templateDir, projectDir, templateData)) {
      console.log(chalk.green('CREATE'), transformOutputPath(replaceHbs(templateFile)));
      ++processed;
    } else {
      ++warnings;
    }
  });

  return { processed, warnings };
}
