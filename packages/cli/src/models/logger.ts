import chalk from 'chalk';

interface LogEvent {
  type: 'error' | 'warning' | 'info' | 'debug';
  event: string; // уникальный идентификатор
  message: string;
  payload?: any;
}

export class Logger {
  event(event: LogEvent): void {
    if (event.type === 'error') {
      console.error(
        chalk.red(event.type),
        chalk.bgRed(event.event),
        event.message,
        event.payload ?? ''
      );
    } else if (event.type === 'warning') {
      console.warn(
        chalk.yellow(event.type),
        chalk.bgYellow(event.event),
        event.message,
        event.payload ?? ''
      );
    } else if (event.type === 'info' || process.env.DEBUG_MODE === 'true') {
      console.log(
        chalk.magenta(event.type),
        chalk.bgMagenta(event.event),
        event.message,
        event.payload ?? ''
      );
    }
  }
}
