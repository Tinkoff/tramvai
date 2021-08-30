import toArray from '@tinkoff/utils/array/toArray';
import applyOrReturn from '@tinkoff/utils/function/applyOrReturn';
import type {
  slotRecordMap,
  HtmlPageStorage as Interface,
  RunnerProps,
  slotHandlersMap,
} from './storage.h';
import type { ISlotHandler } from './typings/slotHandler';
import type { IRecord } from './constants/records';

export class HtmlPageStorage implements Interface {
  private slots: slotRecordMap = new Map();

  private slotsHandlers: slotHandlersMap = new Map();

  registerSlotHandler(slot: string, handler: ISlotHandler) {
    const { slotsHandlers } = this;
    const currentSlotHandlers = slotsHandlers.get(slot);

    currentSlotHandlers
      ? currentSlotHandlers.add(handler)
      : slotsHandlers.set(slot, new Set([handler]));
  }

  runSlotHandlers(slot: string, { cspToken }: RunnerProps) {
    const handlers = this.slotsHandlers.get(slot);
    const slotsState = this.slots;
    const slotState = slotsState.get(slot) || slotsState.set(slot, new Set()).get(slot);
    return (
      handlers &&
      handlers.forEach((handler) => {
        const options: RunnerProps = { cspToken };
        const result: any = applyOrReturn([options], handler);
        const records: IRecord[] = toArray(result);

        return records.forEach((entry: IRecord) => slotState?.add(entry));
      })
    );
  }

  getRecord(slot: string) {
    return this.slots.get(slot);
  }
}
