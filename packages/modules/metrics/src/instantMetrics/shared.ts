import { COMBINE_REDUCERS } from '@tramvai/module-common';
import { MetricsStore, State } from './store';

export const sharedProviders = [
  {
    provide: COMBINE_REDUCERS,
    multi: true,
    useValue: [MetricsStore],
  },
];
