import { COMBINE_REDUCERS } from '@tramvai/tokens-common';
import { MetricsStore } from './store';

export const sharedProviders = [
  {
    provide: COMBINE_REDUCERS,
    multi: true,
    useValue: [MetricsStore],
  },
];
