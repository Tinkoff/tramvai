import ansiEscapes from 'ansi-escapes';
import wrapAnsi from 'wrap-ansi';

// Based on https://github.com/sindresorhus/log-update/blob/master/index.js

const originalWrite = Symbol('webpackbarWrite');

export default class LogUpdate {
  private prevLineCount: any;
  private listening: any;
  private finished: any;
  private extraLines: any;
  private _streams: any;

  constructor() {
    this.prevLineCount = 0;
    this.listening = false;
    this.finished = false;
    this.extraLines = '';
    this._onData = this._onData.bind(this);
    this._streams = [process.stdout, process.stderr];
  }

  get columns() {
    return (process.stderr.columns || 80) - 2;
  }

  write(data) {
    const stream = process.stderr;
    if (stream.write[originalWrite]) {
      stream.write[originalWrite].call(stream, data, 'utf-8');
    } else {
      stream.write(data, 'utf-8');
    }
  }

  start() {
    this.finished = false;
    this.listen();
  }

  clear() {
    this.write(ansiEscapes.eraseLines(this.prevLineCount));
  }

  done() {
    this.stopListen();
    this.finished = true;
    this.prevLineCount = 0;
  }

  listen() {
    // Prevent listening more than once
    if (this.listening) {
      return;
    }

    // Spy on all streams
    for (const stream of this._streams) {
      // Prevent overriding more than once
      if (stream.write[originalWrite]) {
        continue;
      }

      // Create a wrapper fn
      const write = (data, ...args) => {
        if (!stream.write[originalWrite]) {
          return stream.write(data, ...args);
        }

        this._onData(data);
      };

      // Backup original write fn
      write[originalWrite] = stream.write;

      // Override write fn
      stream.write = write;
    }

    this.listening = true;
  }

  stopListen() {
    // Restore original write fns
    for (const stream of this._streams) {
      if (stream.write[originalWrite]) {
        stream.write = stream.write[originalWrite];
      }
    }

    this.listening = false;
  }

  _onData(data) {
    this.extraLines += data;
  }

  render(lines) {
    if (this.finished) {
      // ignore render calls after done call, they are called by the ProgressPlugin,
      // after webpack "done" hook trigger webpackbar done callback
      return;
    }

    const wrappedLines = wrapAnsi(lines, this.columns, {
      trim: false,
      hard: true,
      wordWrap: false,
    });

    const data = `${ansiEscapes.eraseLines(this.prevLineCount)}${this.extraLines}${wrappedLines}`;

    this.write(data);

    this.extraLines = '';
    this.prevLineCount = wrappedLines.split('\n').length;
  }
}
