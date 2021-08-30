import { LEVELS } from '../constants';

export const parseState = (value?: string) => {
  if (!value) {
    return;
  }

  const names = value.split(',');

  return {
    level: LEVELS.silent,
    enabledLevel: Array(names.length).fill(LEVELS.trace),
    enabledName: names,
  };
};
