import chalk from 'chalk';
import type { Container } from '@tinkoff/dippy';
import { successBox } from '../../../utils/formatting';
import { UI_SHOW_BANNER_TOKEN, CONFIG_MANAGER_TOKEN, STDOUT_TOKEN } from '../../../di/tokens';

const label = (name) => chalk.bold.cyan(`▸ ${name}:`);

export function showBanner(di: Container) {
  if (!di.get({ token: UI_SHOW_BANNER_TOKEN, optional: true })) {
    return;
  }

  const config = di.get(CONFIG_MANAGER_TOKEN);

  const titleLines = [];
  const messageLines = [];

  titleLines.push(`${chalk.yellow.bold('tramvai cli')}\n`);

  // Features
  if (config.type !== 'application') {
    titleLines.push(`${label('Type')}             ${config.type}`);
  }
  titleLines.push(`${label('Modern')}           ${config.modern}`);
  titleLines.push(`${label('ReactRefresh')}     ${config.hotRefresh}`);

  if (config.build.configurations.fileSystemPages.enable) {
    titleLines.push(`${label('FileSystemPages')}  true`);
  }

  const server = `http://${config.host.replace('0.0.0.0', 'localhost')}:${config.port}`;
  const staticServer = `http://${config.staticHost.replace('0.0.0.0', 'localhost')}:${
    config.staticPort
  }`;

  if (config.type === 'application') {
    // Listeners
    messageLines.push(chalk.bold('Static: ') + chalk.underline.blue(staticServer));
    messageLines.push(chalk.bold('App:    ') + chalk.underline.blue(server));
  }

  if (config.type === 'child-app') {
    messageLines.push(chalk.bold('Base Url: ') + chalk.underline.blue(`${server}/`));

    messageLines.push(
      chalk.bold('JS:       ') +
        chalk.underline.blue(`${config.name}/${config.name}_(client|server)@${config.version}.js`)
    );

    messageLines.push(
      chalk.bold('CSS:      ') +
        chalk.underline.blue(`${config.name}/${config.name}@${config.version}.css`)
    );
  }

  di.get(STDOUT_TOKEN).write(successBox(titleLines, messageLines));
}
