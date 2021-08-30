import { createReducer } from '@tramvai/state';

const EnvironmentStore = createReducer<Record<string, string>, 'environment'>('environment', {});

export { EnvironmentStore };
