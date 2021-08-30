import type { Provider } from '@tinkoff/dippy';
import {
  ANALYTICS_TOKEN,
  ANALYTICS_TRACKING_CODE_TOKEN,
  ANALYTICS_PACKAGE_INFO_TOKEN,
} from '../tokens';
import { Analytics } from '../../models/analytics';

export const analyticsProviders: readonly Provider[] = [
  {
    provide: ANALYTICS_TOKEN,
    useClass: Analytics,
    deps: {
      trackingCode: ANALYTICS_TRACKING_CODE_TOKEN,
      packageInfo: ANALYTICS_PACKAGE_INFO_TOKEN,
    },
  },
  {
    provide: ANALYTICS_TRACKING_CODE_TOKEN,
    useValue: 'UA-122261674-1',
  },
] as const;
