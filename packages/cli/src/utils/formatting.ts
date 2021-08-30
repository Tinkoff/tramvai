import chalk from 'chalk';
import boxen from 'boxen';

export function box(title: string[], message: string[], options: boxen.Options) {
  return `${boxen([].concat(title, '', message).join('\n'), {
    borderColor: 'white',
    borderStyle: boxen.BorderStyle.Round,
    padding: 1,
    margin: 1,
    ...options,
  })}\n`;
}

export function successBox(title: string[], message: string[]) {
  return box(title || [chalk.green('✔ Tramvai Success')], message, {
    borderColor: 'yellow',
  });
}
