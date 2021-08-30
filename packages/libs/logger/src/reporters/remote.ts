import noop from '@tinkoff/utils/function/noop';
import pathEq from '@tinkoff/utils/object/pathEq';
import type { Reporter, LogObj } from '../logger.h';
import type { LEVELS } from '../constants';
import { formatJson } from './utils/formatJson';

type EmitLevels = Partial<Record<keyof typeof LEVELS, boolean>>;
type MakeRequest = (logObj: Record<string, any>) => Promise<any>;

export class RemoteReporter implements Reporter {
  private requestCount: number;

  private makeRequest: MakeRequest;

  private emitLevels: EmitLevels;

  private reqCount = 0;

  private queue: LogObj[] = [];

  constructor({
    requestCount,
    makeRequest,
    emitLevels,
  }: {
    requestCount?: number;
    makeRequest: MakeRequest;
    emitLevels?: EmitLevels;
  }) {
    this.requestCount = requestCount || 1;
    this.makeRequest = makeRequest;
    this.emitLevels = emitLevels || { fatal: true };
  }

  checkQueue() {
    if (this.queue.length && this.reqCount < this.requestCount) {
      this.sendRequest();
    }
  }

  sendRequest() {
    const logObj = this.queue.shift();
    // eslint-disable-next-line no-plusplus
    this.reqCount++;

    // eslint-disable-next-line promise/catch-or-return
    this.makeRequest(formatJson(logObj))
      .catch(noop)
      .then(() => {
        // eslint-disable-next-line no-plusplus
        this.reqCount--;
        this.checkQueue();
      });
  }

  remote(logObj: LogObj) {
    this.queue.push(logObj);
    this.checkQueue();
  }

  log(logObj: LogObj) {
    const { type, remote } = logObj;

    if (remote != null) {
      if (remote === true || pathEq(['emitLevels', type], true, remote)) {
        this.remote({ ...logObj, remote: undefined });
      }

      return;
    }

    if (this.emitLevels[type]) {
      this.remote(logObj);
    }
  }
}
