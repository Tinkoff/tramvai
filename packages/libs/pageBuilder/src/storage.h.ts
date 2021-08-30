import type { IRecord } from './constants/records';
import type { ISlotHandler } from './typings/slotHandler';
import type { Options } from './pageBuilder';

export type slotRecordMap = Map<string, Set<IRecord>>;
export type slotHandlersMap = Map<string, Set<ISlotHandler>>;
export interface RunnerProps {
  cspToken?: string;
}

export interface HtmlPageStorage {
  registerSlotHandler(slot: string, handler: ISlotHandler): void;
  runSlotHandlers(slot: string, RunnerProps: Options): any;
  getRecord(slot: string): any;
}
