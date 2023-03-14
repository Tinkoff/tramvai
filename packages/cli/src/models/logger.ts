import chalk from 'chalk';

export interface LogEvent {
  type: 'success' | 'error' | 'warning' | 'info' | 'debug';
  event: string; // уникальный идентификатор
  message: string;
  payload?: any;
}

export class Logger {
  event(event: LogEvent): void {
    if (event.type === 'success') {
      console.log(
        chalk.bgGreen(event.type),
        chalk.green(event.event),
        event.message,
        event.payload ?? ''
      );
    } else if (event.type === 'error') {
      console.error(
        chalk.bgRed(event.type),
        chalk.red(event.event),
        event.message,
        event.payload ?? ''
      );
    } else if (event.type === 'warning') {
      console.warn(
        chalk.bgYellow(event.type),
        chalk.yellow(event.event),
        event.message,
        event.payload ?? ''
      );
    } else if (event.type === 'info' || process.env.DEBUG_MODE === 'true') {
      console.log(
        chalk.bgMagenta(event.type),
        chalk.magenta(event.event),
        event.message,
        event.payload ?? ''
      );
    }
  }
}
