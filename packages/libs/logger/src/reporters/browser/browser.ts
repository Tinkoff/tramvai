import type { LogObj, Reporter } from '../../logger.h';

export class BrowserReporter implements Reporter {
  private defaultColor: string;

  private levelColorMap: Record<number, string>;

  private typeColorMap: Record<string, string>;

  constructor() {
    this.defaultColor = '#7f8c8d'; // Gray
    this.levelColorMap = {
      0: '#c00046', // Red
      10: '#c0392b', // Red
      20: '#f39c12', // Yellow
      30: '#00BCD4', // Cyan
    };
  }

  log(logObj: LogObj) {
    const consoleLogFn =
      // eslint-disable-next-line no-nested-ternary, no-console
      logObj.level < 20 ? console.error : logObj.level === 20 ? console.warn : console.log;

    // Styles
    const color = this.levelColorMap[logObj.level] || this.defaultColor;
    const style = `
      background: ${color};
      border-radius: 0.5em;
      color: white;
      font-weight: bold;
      padding: 2px 0.5em;
    `;

    const badge = `%c${[logObj.name, logObj.type].filter(Boolean).join(':')}`;

    // Log to the console
    if (typeof logObj.args[0] === 'string') {
      consoleLogFn.call(
        console,
        `${badge}%c ${logObj.args[0]}`,
        style,
        // Empty string as style resets to default console style
        '',
        ...logObj.args.slice(1)
      );
    } else {
      consoleLogFn.call(console, badge, style, ...logObj.args);
    }
  }
}
