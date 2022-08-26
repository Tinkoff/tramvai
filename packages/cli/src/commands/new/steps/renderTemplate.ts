import chalk from 'chalk';
import { applyTemplate } from '../utils/applyTemplate';

export async function renderTemplate(templateDir: string, projectDir: string, templateData) {
  console.log(chalk.blue('[TEMPLATE]'), 'Copying files');
  return applyTemplate(templateDir, projectDir, templateData);
}
