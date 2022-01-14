import type { Component } from '@tramvai/tokens-common';

export const resolveComponent = async <T extends Component>(
  componentOrLoader: T | { load: () => Promise<{ default: T }> }
): Promise<T> => {
  return 'load' in componentOrLoader && typeof componentOrLoader.load === 'function'
    ? (await componentOrLoader.load()).default
    : (componentOrLoader as T);
};
