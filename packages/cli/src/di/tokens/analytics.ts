import { createToken } from '@tinkoff/dippy';
import type { Analytics } from '../../models/analytics';

export const ANALYTICS_TOKEN = createToken<Analytics>('analytics');
export const ANALYTICS_TRACKING_CODE_TOKEN = createToken<string>('analytics trackingCode');
export const ANALYTICS_PACKAGE_INFO_TOKEN = createToken<{ name: string; version: string }>(
  'analytics packageVersion'
);
