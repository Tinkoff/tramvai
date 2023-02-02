import chalk from 'chalk';
import type { Container } from '@tinkoff/dippy';
import { successBox } from '../../../utils/formatting';
import { UI_SHOW_BANNER_TOKEN, CONFIG_MANAGER_TOKEN, STDOUT_TOKEN } from '../../../di/tokens';
import { getDocUrl, getTip } from './tips';
import { isApplication } from '../../../config/validate';

const label = (name) => chalk.bold.cyan(`▸ ${name}:`);
const link = (url) => chalk.underline.blue(url);

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
  titleLines.push(`${label('ReactRefresh')}     ${config.hotRefresh.enabled}`);

  if (isApplication(config) && config.fileSystemPages.enabled) {
    titleLines.push(`${label('FileSystemPages')}  true`);
  }

  const server = `http://${config.host.replace('0.0.0.0', 'localhost')}:${config.port}`;
  const staticServer = `http://${config.staticHost.replace('0.0.0.0', 'localhost')}:${
    config.staticPort
  }`;

  if (config.type === 'application') {
    // Listeners
    messageLines.push(chalk.bold('Static: ') + link(staticServer));
    messageLines.push(chalk.bold('App:    ') + link(server));
  }

  if (config.type === 'child-app') {
    messageLines.push(chalk.bold('Base Url: ') + link(`${server}/`));

    messageLines.push(
      chalk.bold('JS:       ') +
        link(`${config.name}/${config.name}_(client|server)@${config.version}.js`)
    );

    messageLines.push(
      chalk.bold('CSS:      ') + link(`${config.name}/${config.name}@${config.version}.css`)
    );
  }

  const tip = getTip(di);

  if (tip) {
    messageLines.push(
      `
${chalk.italic.yellow('Tip of the day:')}

${tip.text}

${chalk.bold.green('Related documentation:')}
${link(`${getDocUrl(tip.docLink)}`)}`
    );
  }

  di.get(STDOUT_TOKEN).write(successBox(titleLines, messageLines));
}
