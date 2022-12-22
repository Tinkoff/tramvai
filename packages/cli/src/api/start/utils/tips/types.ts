import type { Container } from '@tinkoff/dippy';

export interface TramvaiTip {
  text: string;
  docLink: string;
  isApplicable: (di: Container) => boolean;
}

export interface TramvaiTipUsageInfo {
  lastTimeShowed: number;
  lastTimeShowedByTip: Record<string, number>;
}
