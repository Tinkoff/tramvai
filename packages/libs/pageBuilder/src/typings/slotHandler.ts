import type { IRecord } from '../constants/records';

export type SlotHandlerOptions = {
  cspToken?: string;
};

export type ISlotHandler =
  | IRecord
  | IRecord[]
  | ((options: SlotHandlerOptions) => IRecord | IRecord[]);
