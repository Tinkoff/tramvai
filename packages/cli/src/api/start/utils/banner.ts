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
    titleLines.push(`${label('Type')}          ${config.type}`);
  }
  titleLines.push(`${label('Modern')}        ${config.modern}`);
  titleLines.push(`${label('ReactRefresh')}  ${config.hotRefresh}`);

  // Listeners
  messageLines.push(
    chalk.bold('Static: ') + chalk.underline.blue(`${config.staticHost}:${config.staticPort}`)
  );
  messageLines.push(
    chalk.bold('App:    ') + chalk.underline.blue(`http://${config.host}:${config.port}`)
  );

  di.get(STDOUT_TOKEN).write(successBox(titleLines, messageLines));
}
