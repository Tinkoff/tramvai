import filterObj from '@tinkoff/utils/object/filter';
import type { DEPENDENCIES_VERSION_FILTER_TOKEN } from '@tramvai/tokens-server';

const RegExp = /^@tramvai/;

export const tramvaiDepsFilter: typeof DEPENDENCIES_VERSION_FILTER_TOKEN = (deps) => {
  return filterObj((v, k) => RegExp.test(k), deps);
};
